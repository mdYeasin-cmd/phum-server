import { z } from "zod";

const createAcademicFacultyValidationSchema = z.object({
    body: z.object({
        name: z.string({
            invalid_type_error: "Academic faculty name must be a string",
            required_error: "Faculty is required",
        }),
    }),
});

const updateAcademicFacultyValidationSchema = z.object({
    body: z.object({
        name: z.string({
            invalid_type_error: "Academic faculty name must be a string",
            required_error: "Faculty is required",
        }),
    }),
});

export const AcademicFacultyValidations = {
    createAcademicFacultyValidationSchema,
    updateAcademicFacultyValidationSchema,
};
