import QueryBuilder from "../../builder/QueryBuilder";
import { AcademicDepartmentSearchableFields } from "./academicDepartment.constant";
import { TAcademicDepartment } from "./academicDepartment.interface";
import { AcademicDepartment } from "./academicDepartment.model";

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
    const result = await AcademicDepartment.create(payload);
    return result;
};

const getAllAcademicDepartmentsFromDB = async (
    query: Record<string, unknown>,
) => {
    const academicDepartmentQuery = new QueryBuilder(
        AcademicDepartment.find().populate("academicFaculty"),
        query,
    )
        .search(AcademicDepartmentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await academicDepartmentQuery.modelQuery;
    const meta = await academicDepartmentQuery.countTotal();

    return {
        meta,
        result,
    };
};

const getSingleAcademicDepartmentFromDB = async (departmentId: string) => {
    const result = await AcademicDepartment.findOne({
        _id: departmentId,
    }).populate("academicFaculty");
    return result;
};

const updateSingleAcademicDepartmentIntoDB = async (
    departmentId: string,
    payload: Partial<TAcademicDepartment>,
) => {
    const result = await AcademicDepartment.findOneAndUpdate(
        { _id: departmentId },
        payload,
        {
            new: true,
        },
    );

    return result;
};

export const AcademicDepartmentServices = {
    createAcademicDepartmentIntoDB,
    getAllAcademicDepartmentsFromDB,
    getSingleAcademicDepartmentFromDB,
    updateSingleAcademicDepartmentIntoDB,
};
