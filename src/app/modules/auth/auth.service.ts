import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import bcrypt from "bcrypt";
import { createToken, verifyToken } from "./auth.utils";
import { sendEmail } from "../../utils/sendEmail";

const loginUser = async (payload: TLoginUser) => {
    const user = await User.isUserExistsByCustomId(payload?.id);

    // check if ther user is exist!
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "This user is not found!");
    }

    // check if the user is deleted!
    const isDeleted = user?.isDeleted;

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "This user is deleted!");
    }

    // check if the user is blocked!
    const userStatus = user?.status;

    if (userStatus === "blocked") {
        throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
    }

    // check if the password is correct!
    if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
        throw new AppError(httpStatus.FORBIDDEN, "Password do not matched!");
    }

    // create token and sent to the client
    const jwtPayload = {
        userId: user?.id,
        role: user?.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string,
    );

    // Access Granted: Send AccessToken, RefreshToken

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user?.needsPasswordChange,
    };
};

const changePassword = async (
    userData: JwtPayload,
    payload: { oldPassword: string; newPassword: string },
) => {
    const { userId, role } = userData;

    console.log({ userData });

    const user = await User.isUserExistsByCustomId(userId);

    // check if ther user is exist!
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "This user is not found!");
    }

    // check if the user is deleted!
    const isDeleted = user?.isDeleted;

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "This user is deleted!");
    }

    // check if the user is blocked!
    const userStatus = user?.status;

    if (userStatus === "blocked") {
        throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
    }

    // check if the password is correct!
    if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
        throw new AppError(httpStatus.FORBIDDEN, "Password do not matched!");
    }

    // hash new password
    const newHashedPassword = await bcrypt.hash(
        payload?.newPassword,
        Number(config.bcrypt_salt_rounds),
    );

    await User.findOneAndUpdate(
        { id: userId, role: role },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangeAt: new Date(),
        },
    );

    return null;
};

const refreshToken = async (token: string) => {
    // check if the token is valid!
    const decoded = verifyToken(token, config.jwt_refresh_secret as string);

    const { userId, iat } = decoded;

    const user = await User.isUserExistsByCustomId(userId);

    // check if ther user is exist!
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "This user is not found!");
    }

    // check if the user is deleted!
    const isDeleted = user?.isDeleted;

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "This user is deleted!");
    }

    // check if the user is blocked!
    const userStatus = user?.status;

    if (userStatus === "blocked") {
        throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
    }

    if (
        user?.passwordChangeAt &&
        User.isJWTIssuedBeforePasswordChanged(
            user?.passwordChangeAt,
            iat as number,
        )
    ) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    // create token and sent to the client
    const jwtPayload = {
        userId: user?.id,
        role: user?.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    );

    return {
        accessToken,
    };
};

const forgetPassword = async (userId: string) => {
    const user = await User.isUserExistsByCustomId(userId);

    // check if ther user is exist!
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "This user is not found!");
    }

    // check if the user is deleted!
    const isDeleted = user?.isDeleted;

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "This user is deleted!");
    }

    // check if the user is blocked!
    const userStatus = user?.status;

    if (userStatus === "blocked") {
        throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
    }

    const jwtPayload = {
        userId: user?.id,
        role: user?.role,
    };

    const resetToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        "10m",
    );

    const resetUILink = `${config?.reset_pass_ui_link}?id=${user?.id}&token=${resetToken}`;

    sendEmail(user?.email, resetUILink);
};

const resetPassword = async (
    payload: { id: string; newPassword: string },
    token: string,
) => {
    const user = await User.isUserExistsByCustomId(payload?.id);

    // check if ther user is exist!
    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "This user is not found!");
    }

    // check if the user is deleted!
    const isDeleted = user?.isDeleted;

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, "This user is deleted!");
    }

    // check if the user is blocked!
    const userStatus = user?.status;

    if (userStatus === "blocked") {
        throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
    }

    // check if the token is valid!
    const decoded = verifyToken(token, config.jwt_access_secret as string);

    const { userId, role } = decoded;

    if (payload?.id !== userId) {
        throw new AppError(httpStatus.FORBIDDEN, "You are forbidden!");
    }

    // hash new password
    const newHashedPassword = await bcrypt.hash(
        payload?.newPassword,
        Number(config.bcrypt_salt_rounds),
    );

    await User.findOneAndUpdate(
        { id: userId, role: role },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangeAt: new Date(),
        },
    );
};

export const AuthServices = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
