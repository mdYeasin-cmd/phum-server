import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { SemesterRegistrationServices } from "./semesterRegistration.service";

const createSemesterRegistration = catchAsync(
    async (req: Request, res: Response) => {
        const result =
            await SemesterRegistrationServices.createSemesterRegistrationIntoDB(
                req.body,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Semester Registration is created successfully!",
            data: result,
        });
    },
);

const getAllSemesterRegistrations = catchAsync(
    async (req: Request, res: Response) => {
        const result =
            await SemesterRegistrationServices.getAllSemesterRegistrationsFromDB(
                req.query,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Semester Registrations are retrieved successfully!",
            data: result,
        });
    },
);

const getSingleSemesterRegistration = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const result =
            await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(
                id,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Semester Registration is retrieved successfully!",
            data: result,
        });
    },
);

const updateSemesterRegistration = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const semesterRegistrationData = req.body;

        const result =
            await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(
                id,
                semesterRegistrationData,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Semester Registration is retrieved successfully!",
            data: result,
        });
    },
);

const deleteSemesterRegistration = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result =
            await SemesterRegistrationServices.deleteSemesterRegistrationFromDB(
                id,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Semester Registration is deleted successfully",
            data: result,
        });
    },
);

export const SemesterRegistrationControllers = {
    createSemesterRegistration,
    getAllSemesterRegistrations,
    getSingleSemesterRegistration,
    updateSemesterRegistration,
    deleteSemesterRegistration,
};
