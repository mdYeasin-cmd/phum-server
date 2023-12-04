import { TAcademicSemester } from "../academicSemester/academicSemester.interface";
import { User } from "./user.model";

// last student
export const findLastStudentId = async () => {
    const lastStudent = await User.findOne(
        {
            role: "student",
        },
        {
            id: 1,
            _id: 0,
        },
    )
        .sort({ createdAt: -1 })
        .lean();

    return lastStudent?.id ? lastStudent.id : undefined;
};

// generate student id
export const generateStudentId = async (payload: TAcademicSemester) => {
    let currentId = (0).toString();

    const lastStudentId = await findLastStudentId();

    const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
    const lastStudentYear = lastStudentId?.substring(0, 4);
    const currentStudentSemesterCode = payload.code;
    const currentStudentYear = payload.year;

    if (
        lastStudentId &&
        lastStudentSemesterCode === currentStudentSemesterCode &&
        lastStudentYear === currentStudentYear
    ) {
        currentId = lastStudentId.substring(6); // 0001
    }

    let incrementId = (Number(currentId) + 1).toString().padStart(4, "0");

    incrementId = `${payload.year}${payload.code}${incrementId}`;

    return incrementId;
};
