import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AcademicDepartmentServices } from "./academicDepartment.service";

const createAcademicDepartment = catchAsync(async (req, res) => {
    const result =
        await AcademicDepartmentServices.createAcademicDepartmentIntoDB(
            req.body,
        );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic Department is created successfully",
        data: result,
    });
});

const getAllAcademicDepartments = catchAsync(async (req, res) => {
    const result =
        await AcademicDepartmentServices.getAllAcademicDepartmentsFromDB(
            req.query,
        );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Academic departments are retrieved successfully",
        meta: result.meta,
        data: result.result,
    });
});

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
    const { departmentId } = req.params;
    const result =
        await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(
            departmentId,
        );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "A academic department is retrieved successfully",
        data: result,
    });
});

const updateSingleAcademicDepartment = catchAsync(async (req, res) => {
    const { departmentId } = req.params;
    const departmentData = req.body;
    const result =
        await AcademicDepartmentServices.updateSingleAcademicDepartmentIntoDB(
            departmentId,
            departmentData,
        );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "A academic department is updated successfully",
        data: result,
    });
});

export const AcademicDepartmentControllers = {
    createAcademicDepartment,
    getAllAcademicDepartments,
    getSingleAcademicDepartment,
    updateSingleAcademicDepartment,
};
