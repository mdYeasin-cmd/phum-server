import mongoose from "mongoose";
import { Student } from "./student.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import { TStudent } from "./student.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { studentSearchableFeilds } from "./student.constant";

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
    const studentQuery = new QueryBuilder(
        Student.find()
            .populate("user")
            .populate("admissionSemester")
            .populate("academicDepartment academicFaculty"),
        query,
    )
        .search(studentSearchableFeilds)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await studentQuery.modelQuery;

    const meta = await studentQuery.countTotal();

    return { result, meta };
};

const getSingleStudentFromDB = async (id: string) => {
    const result = Student.findById(id)
        .populate("admissionSemester")
        .populate({
            path: "academicDepartment",
            populate: {
                path: "academicFaculty",
            },
        });

    return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
    const { name, gurdian, localGurdian, ...remainingStudentData } = payload;

    const modifiedUpdatedData: Record<string, unknown> = {
        ...remainingStudentData,
    };

    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value;
        }
    }

    if (gurdian && Object.keys(gurdian).length) {
        for (const [key, value] of Object.entries(gurdian)) {
            modifiedUpdatedData[`gurdian.${key}`] = value;
        }
    }

    if (localGurdian && Object.keys(localGurdian).length) {
        for (const [key, value] of Object.entries(localGurdian)) {
            modifiedUpdatedData[`localGurdian.${key}`] = value;
        }
    }

    const result = Student.findByIdAndUpdate(id, modifiedUpdatedData, {
        new: true,
        runValidators: true,
    });
    return result;
};

const deleteStudentFromDB = async (id: string) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const deletedStudent = await Student.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true, session },
        );

        if (!deletedStudent) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "Failed to delete student!",
            );
        }

        // get user _id from deletedAdmin
        const userId = deletedStudent.user; // Here userId is object id

        const deletedUser = await User.findByIdAndUpdate(
            userId,
            { isDeleted: true },
            { new: true, session },
        );

        if (!deletedUser) {
            throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete user");
        }

        await session.commitTransaction();
        await session.endSession();

        return deletedStudent;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Failed to delete student! catch",
        );
    }
};

export const StudentServices = {
    getAllStudentsFromDB,
    getSingleStudentFromDB,
    updateStudentIntoDB,
    deleteStudentFromDB,
};
