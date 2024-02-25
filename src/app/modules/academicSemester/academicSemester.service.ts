import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import {
    AcademicSemesterSearchableFields,
    academicSemesterNameCondeMapper,
} from "./academicSemester.constant";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
    // semester name --> semester code
    if (academicSemesterNameCondeMapper[payload.name] !== payload.code) {
        throw new AppError(404, "Invalid semester code!");
    }

    const result = await AcademicSemester.create(payload);
    return result;
};

const getAllAcadmeicSemesterFromDB = async (query: Record<string, unknown>) => {
    const academicSemesterQuery = new QueryBuilder(
        AcademicSemester.find(),
        query,
    )
        .search(AcademicSemesterSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await academicSemesterQuery.modelQuery;
    const meta = await academicSemesterQuery.countTotal();

    return {
        meta,
        result,
    };
};

const getSingleAcademicSemesterFromDB = async (semesterId: string) => {
    const result = await AcademicSemester.findOne({ _id: semesterId });
    return result;
};

const updateSingleAcademicSemesterIntoDB = async (
    semesterId: string,
    payload: Partial<TAcademicSemester>,
) => {
    if (
        payload.name &&
        payload.code &&
        academicSemesterNameCondeMapper[payload.name] !== payload.code
    ) {
        throw new AppError(404, "Invalid semester code!");
    }

    const result = await AcademicSemester.findOneAndUpdate(
        { _id: semesterId },
        payload,
        {
            new: true,
        },
    );

    return result;
};

export const AcademicSemesterServices = {
    createAcademicSemesterIntoDB,
    getAllAcadmeicSemesterFromDB,
    getSingleAcademicSemesterFromDB,
    updateSingleAcademicSemesterIntoDB,
};
