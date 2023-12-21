import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";

const loginUser = async (payload: TLoginUser) => {
    // check if ther user is exist
    const isUserExists = await User.findOne({ id: payload?.id });

    console.log(isUserExists, "payload here");

    if (!isUserExists) {
        throw new AppError(httpStatus.BAD_REQUEST, "This user is not found!");
    }

    return "";
};

export const AuthServices = {
    loginUser,
};
