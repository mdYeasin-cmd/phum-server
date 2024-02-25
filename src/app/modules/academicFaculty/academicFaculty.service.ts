import QueryBuilder from "../../builder/QueryBuilder";
import { AcademicFacultySearchableFields } from "./academicFaculty.constant";
import { TAcademicFaculty } from "./academicFaculty.interface";
import { AcademicFaculty } from "./academicFaculty.model";

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
    const result = await AcademicFaculty.create(payload);
    return result;
};

const getAllAcademicFacultiesFromDB = async (
    query: Record<string, unknown>,
) => {
    const academicFacultyQuery = new QueryBuilder(AcademicFaculty.find(), query)
        .search(AcademicFacultySearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await academicFacultyQuery.modelQuery;
    const meta = await academicFacultyQuery.countTotal();

    return {
        meta,
        result,
    };
};

const getSingleAcademicFacultyFromDB = async (facultyId: string) => {
    const result = await AcademicFaculty.findOne({ _id: facultyId });
    return result;
};

const updateSingleAcademicFacultyIntoDB = async (
    facultyId: string,
    payload: Partial<TAcademicFaculty>,
) => {
    const result = await AcademicFaculty.findOneAndUpdate(
        { _id: facultyId },
        payload,
        {
            new: true,
        },
    );

    return result;
};

export const AcademicFacultyServices = {
    createAcademicFacultyIntoDB,
    getAllAcademicFacultiesFromDB,
    getSingleAcademicFacultyFromDB,
    updateSingleAcademicFacultyIntoDB,
};
