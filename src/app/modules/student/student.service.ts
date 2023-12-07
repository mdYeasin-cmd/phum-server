import mongoose from "mongoose";
import { Student } from "./student.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import { TStudent } from "./student.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { studentSearchableFeilds } from "./student.constant";

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
    // { email: { $regex: query.searchTerm, $option: i }}
    // { presentAddress: { $regex: query.searchTerm, $option: i }}
    // { name.firstName: { $regex: query.searchTerm, $option: i }}

    // const queryObject = { ...query };

    // const studentSearchableFeilds = [
    //     "email",
    //     "name.firstName",
    //     "presentAddress",
    // ];
    // let searchTerm = "";

    // if (query?.searchTerm) {
    //     searchTerm = query?.searchTerm as string;
    // }

    // const searchQuery = Student.find({
    //     $or: studentSearchableFeilds.map((feild) => ({
    //         [feild]: { $regex: searchTerm, $options: "i" },
    //     })),
    // });

    // // filtering
    // const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];

    // excludeFields.forEach((element) => delete queryObject[element]);

    // console.log({ query }, { queryObject });

    // const filterQuery = searchQuery
    //     .find(queryObject)
    //     .populate("admissionSemester")
    //     .populate({
    //         path: "academicDepartment",
    //         populate: {
    //             path: "academicFaculty",
    //         },
    //     });

    // let sort = "-createdAt";

    // if (query.sort) {
    //     sort = query.sort as string;
    // }

    // const sortQuery = filterQuery.sort(sort);

    // let page = 1;
    // let limit = 2;
    // let skip = 0;
    // if (query?.limit) {
    //     limit = Number(query.limit);
    // }

    // if (query.page) {
    //     page = Number(query.page);
    //     skip = (page - 1) * limit;
    // }

    // const paginateQuery = sortQuery.skip(skip);

    // const limitQuery = paginateQuery.limit(limit);

    // // field limiting
    // let fields = "-__v";

    // if (query.fields) {
    //     fields = (query.fields as string).split(",").join(" ");
    // }

    // const fieldQuery = await limitQuery.select(fields);

    // return fieldQuery;

    const studentQuery = new QueryBuilder(
        Student.find()
            .populate("admissionSemester")
            .populate({
                path: "academicDepartment",
                populate: {
                    path: "academicFaculty",
                },
            }),
        query,
    )
        .search(studentSearchableFeilds)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await studentQuery.modelQuery;

    return result;
};

const getSingleStudentFromDB = async (id: string) => {
    const result = Student.findOne({ id })
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

    const result = Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
        new: true,
        runValidators: true,
    });
    return result;
};

const deleteStudentFromDB = async (id: string) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const deletedStudent = await Student.findOneAndUpdate(
            { id },
            { isDeleted: true },
            { new: true, session },
        );

        if (!deletedStudent) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "Failed to delete student!",
            );
        }

        const deletedUser = await User.findOneAndUpdate(
            { id },
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
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete student!");
    }
};

export const StudentServices = {
    getAllStudentsFromDB,
    getSingleStudentFromDB,
    updateStudentIntoDB,
    deleteStudentFromDB,
};
