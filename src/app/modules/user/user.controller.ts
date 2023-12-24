import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

const createStudent = catchAsync(async (req, res) => {
    const file = req.file;

    const { password, student: studentData } = req.body;

    const result = await UserServices.createStudentIntoDB(
        password,
        studentData,
        file,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Student is created successfully",
        data: result,
    });
});

const createFaculty = catchAsync(async (req, res) => {
    const { password, faculty: facultyData } = req.body;

    const result = await UserServices.createFacultyIntoDB(
        password,
        facultyData,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Faculty is created succesfully",
        data: result,
    });
});

const createAdmin = catchAsync(async (req, res) => {
    const { password, admin: adminData } = req.body;

    const result = await UserServices.createAdminIntoDB(password, adminData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin is created succesfully",
        data: result,
    });
});

const getMe = catchAsync(async (req, res) => {
    const { userId, role } = req.user;

    const result = await UserServices.getMe(userId, role);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User is retrieved successfully",
        data: result,
    });
});

const changeStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await UserServices.changeStatus(id, status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Status is updated successfully",
        data: result,
    });
});

export const UserControllers = {
    createStudent,
    createFaculty,
    createAdmin,
    getMe,
    changeStatus,
};
