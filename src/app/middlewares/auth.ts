import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const token = req.headers.authorization;

            // check if the token is sent from the client!
            if (!token) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    "You are not authorized!",
                );
            }

            // check if the token is valid!
            let decoded;

            try {
                decoded = jwt.verify(
                    token,
                    config.jwt_access_secret as string,
                ) as JwtPayload;
            } catch (error) {
                throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
            }

            req.user = decoded;

            const { userId, role, iat } = decoded;

            const user = await User.isUserExistsByCustomId(userId);

            // check if ther user is exist!
            if (!user) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    "This user is not found!",
                );
            }

            // check if the user is deleted!
            const isDeleted = user?.isDeleted;

            if (isDeleted) {
                throw new AppError(
                    httpStatus.FORBIDDEN,
                    "This user is deleted!",
                );
            }

            // check if the user is blocked!
            const userStatus = user?.status;

            if (userStatus === "blocked") {
                throw new AppError(
                    httpStatus.FORBIDDEN,
                    "This user is blocked!",
                );
            }

            // isJWTIssuedBeforePasswordChanged mongoose middleware is a synchronous, we can't use await here
            const isJWTIssuedBeforePasswordChanged =
                User.isJWTIssuedBeforePasswordChanged(
                    user?.passwordChangeAt as Date,
                    iat as number,
                );

            if (user?.passwordChangeAt && isJWTIssuedBeforePasswordChanged) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    "You are not authorized!",
                );
            }

            if (requiredRoles && !requiredRoles.includes(role)) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    "You are not authorized!",
                );
            }

            next();
        },
    );
};

export default auth;
