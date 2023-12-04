import { TAcademicFaculty } from "./academicFaculty.interface";
import { AcademicFaculty } from "./academicFaculty.model";

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
    const result = await AcademicFaculty.create(payload);
    return result;
};

const getAllAcademicFacultiesFromDB = async () => {
    const result = await AcademicFaculty.find();
    return result;
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
