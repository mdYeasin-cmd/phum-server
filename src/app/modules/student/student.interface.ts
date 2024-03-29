import { Model, Types } from "mongoose";

export type TGurdian = {
    fatherName: string;
    fatherOccupation: string;
    fatherContactNo: string;
    motherName: string;
    motherOccupation: string;
    motherContactNo: string;
};

export type TLocalGurdian = {
    name: string;
    occupation: string;
    contactNo: string;
    address: string;
};

export type TUserName = {
    firstName: string;
    middleName?: string;
    lastName: string;
};

export type TStudent = {
    id: string;
    user: Types.ObjectId;
    name: TUserName;
    gender: "male" | "female" | "other";
    dateOfBirth?: Date;
    email: string;
    contactNo: string;
    emergencyContactNo: string;
    bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
    presentAddress: string;
    permanentAddress: string;
    gurdian: TGurdian;
    localGurdian: TLocalGurdian;
    profileImg?: string;
    admissionSemester: Types.ObjectId;
    academicDepartment: Types.ObjectId;
    academicFaculty: Types.ObjectId;
    isDeleted: boolean;
};

// for creating statics
export interface StudentModel extends Model<TStudent> {
    // eslint-disable-next-line no-unused-vars
    isUserExists(id: string): Promise<TStudent | null>;
}
