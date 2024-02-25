import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AcademicSemesterServices } from "./academicSemester.service";

const createAcademicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic semester is created successfully",
        data: result,
    });
});

const getAllAcadmeicSemester = catchAsync(async (req, res) => {
    const result = await AcademicSemesterServices.getAllAcadmeicSemesterFromDB(
        req.query,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic semesters retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
});

const getSingleAcademicSemester = catchAsync(async (req, res) => {
    const { semesterId } = req.params;
    const result =
        await AcademicSemesterServices.getSingleAcademicSemesterFromDB(
            semesterId,
        );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "A academic semester retrieved successfully",
        data: result,
    });
});

const updateSingleAcademicSemester = catchAsync(async (req, res) => {
    const { semesterId } = req.params;
    const semesterData = req.body;
    const result =
        await AcademicSemesterServices.updateSingleAcademicSemesterIntoDB(
            semesterId,
            semesterData,
        );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "A academic semester updated successfully",
        data: result,
    });
});

export const AcademicSemesterControllers = {
    createAcademicSemester,
    getAllAcadmeicSemester,
    getSingleAcademicSemester,
    updateSingleAcademicSemester,
};
