import { UserServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

const createStudent = catchAsync(async (req, res) => {
    const { password, student: studentData } = req.body;

    console.log(studentData, "student data console");

    // const { error, value } = studentValidationSchema.validate(studentData);

    // console.log({ error }, { value });

    // if (error) {
    //   res.status(500).json({
    //     success: false,
    //     message: "Student can not create",
    //     error: error.details,
    //   });
    // }

    // const zodparsedData = studentValidationSchema.parse(studentData);

    const result = await UserServices.createStudentIntoDB(
        password,
        studentData,
    );

    console.log(result, "this is result");

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Student is created successfully",
        data: result,
    });
});

export const UserControllers = {
    createStudent,
};
