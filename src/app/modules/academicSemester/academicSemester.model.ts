import { Schema, model } from "mongoose";
import { TAcademicSemester } from "./academicSemester.interface";
import {
    AcademicSemesterCode,
    AcademicSemesterName,
    Months,
} from "./academicSemester.constant";

const academicSemesterSchema = new Schema<TAcademicSemester>({
    name: {
        type: String,
        enum: AcademicSemesterName,
        required: true,
    },
    code: {
        type: String,
        enum: AcademicSemesterCode,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    startMonth: {
        type: String,
        enum: Months,
    },
    endMonth: {
        type: String,
        enum: Months,
    },
});

academicSemesterSchema.pre("save", async function (next) {
    const isSemesterExists = await AcademicSemester.findOne({
        name: this.name,
        year: this.year,
    });

    if (isSemesterExists) {
        throw new Error("Semester is already exists");
    }

    next();
});

export const AcademicSemester = model<TAcademicSemester>(
    "AcademicSemester",
    academicSemesterSchema,
);
