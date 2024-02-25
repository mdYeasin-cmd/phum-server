import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AcademicFacultyServices } from "./academicFaculty.service";

const createAcademicFaculty = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic faculty is created successfully",
        data: result,
    });
});

const getAllAcademicFaculties = catchAsync(async (req, res) => {
    const result = await AcademicFacultyServices.getAllAcademicFacultiesFromDB(
        req.query,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic faculties retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
});

const getSingleAcademicFaculty = catchAsync(async (req, res) => {
    const { facultyId } = req.params;
    const result =
        await AcademicFacultyServices.getSingleAcademicFacultyFromDB(facultyId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "A academic faculty is retrieved successfully",
        data: result,
    });
});

const updateSingleAcademicFaculty = catchAsync(async (req, res) => {
    const { facultyId } = req.params;
    const facultyData = req.body;
    const result =
        await AcademicFacultyServices.updateSingleAcademicFacultyIntoDB(
            facultyId,
            facultyData,
        );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "A academic faculty is updated successfully",
        data: result,
    });
});

export const AcademicFacultyControllers = {
    createAcademicFaculty,
    getAllAcademicFaculties,
    getSingleAcademicFaculty,
    updateSingleAcademicFaculty,
};
