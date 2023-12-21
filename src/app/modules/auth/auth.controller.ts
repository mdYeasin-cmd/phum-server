import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AuthServices } from "./auth.service";

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const authData = req.body;

    const result = await AuthServices.loginUser(authData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User is logged in successfully",
        data: result,
    });
});

export const AuthControllers = {
    loginUser,
};
