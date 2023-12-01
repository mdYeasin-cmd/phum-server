import { academicSemesterNameCondeMapper } from "./academicSemester.constant";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
    // semester name --> semester code
    if (academicSemesterNameCondeMapper[payload.name] !== payload.code) {
        throw new Error("Invalid semester code!");
    }

    const result = await AcademicSemester.create(payload);
    return result;
};

const getAllAcadmeicSemesterFromDB = async () => {
    const result = await AcademicSemester.find();
    return result;
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
        throw new Error("Invalid semester code!");
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
