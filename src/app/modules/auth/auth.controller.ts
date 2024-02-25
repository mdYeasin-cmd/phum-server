import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AuthServices } from "./auth.service";
import config from "../../config";

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const authData = req.body;

    const result = await AuthServices.loginUser(authData);

    const { refreshToken, ...remainingInfo } = result;

    res.cookie("refreshToken", refreshToken, {
        secure: config.node_env === "production",
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User is logged in successfully",
        data: remainingInfo,
    });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const user = req?.user;
    const passwordData = req?.body;

    const result = await AuthServices.changePassword(user, passwordData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password is changed successfully",
        data: result,
    });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const result = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Access token is retrieved successfully",
        data: result,
    });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.body;

    const result = await AuthServices.forgetPassword(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Reset link is generated successfully",
        data: result,
    });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    const userData = req.body;

    const result = await AuthServices.resetPassword(userData, token as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password is reset successfully",
        data: result,
    });
});

export const AuthControllers = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
