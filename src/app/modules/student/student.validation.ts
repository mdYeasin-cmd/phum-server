import { z } from "zod";

const createUserNameValidationSchema = z.object({
    firstName: z
        .string()
        .max(25)
        .refine((value) => /^[A-Z]/.test(value), {
            message: "First Name must be start with capital letter",
        }),
    middleName: z.string().optional(),
    lastName: z.string(),
});

const createGurdianValidationSchema = z.object({
    fatherName: z.string(),
    fatherOccupation: z.string(),
    fatherContactNo: z.string(),
    motherName: z.string(),
    motherOccupation: z.string(),
    motherContactNo: z.string(),
});

const createLocalGurdianValidationSchema = z.object({
    name: z.string(),
    occupation: z.string(),
    contactNo: z.string(),
    address: z.string(),
});

const createStudentValidationSchema = z.object({
    body: z.object({
        password: z.string().max(25),
        student: z.object({
            name: createUserNameValidationSchema,
            gender: z.enum(["male", "female", "other"]),
            dateOfBirth: z.string().optional(),
            email: z.string().email(),
            contactNo: z.string(),
            emergencyContactNo: z.string(),
            bloodGroup: z.enum([
                "A+",
                "A-",
                "B+",
                "B-",
                "AB+",
                "AB-",
                "O+",
                "O-",
            ]),
            presentAddress: z.string(),
            permanentAddress: z.string(),
            gurdian: createGurdianValidationSchema,
            localGurdian: createLocalGurdianValidationSchema,
            admissionSemester: z.string(),
            academicDepartment: z.string({
                invalid_type_error: "Academic department name must be a string",
                required_error: "Academic department name is required",
            }),
            profileImg: z.string(),
        }),
    }),
});

const updateUserNameValidationSchema = z.object({
    firstName: z
        .string()
        .max(25)
        .refine((value) => /^[A-Z]/.test(value), {
            message: "First Name must start with a capital letter",
        })
        .optional(),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
});

const updateGurdianValidationSchema = z.object({
    fatherName: z.string().optional(),
    fatherOccupation: z.string().optional(),
    fatherContactNo: z.string().optional(),
    motherName: z.string().optional(),
    motherOccupation: z.string().optional(),
    motherContactNo: z.string().optional(),
});

const updateLocalGurdianValidationSchema = z.object({
    name: z.string().optional(),
    occupation: z.string().optional(),
    contactNo: z.string().optional(),
    address: z.string().optional(),
});

const updateStudentValidationSchema = z.object({
    body: z.object({
        student: z.object({
            name: updateUserNameValidationSchema.optional(),
            gender: z.enum(["male", "female", "other"]).optional(),
            dateOfBirth: z.string().optional(),
            email: z.string().email().optional(),
            contactNo: z.string().optional(),
            emergencyContactNo: z.string().optional(),
            bloodGroup: z
                .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
                .optional(),
            presentAddress: z.string().optional(),
            permanentAddress: z.string().optional(),
            gurdian: updateGurdianValidationSchema.optional(),
            localGurdian: updateLocalGurdianValidationSchema.optional(),
            admissionSemester: z.string().optional(),
            academicDepartment: z
                .string({
                    invalid_type_error:
                        "Academic department name must be a string",
                    required_error: "Academic department name is required",
                })
                .optional(),
            profileImg: z.string().optional(),
        }),
    }),
});

export const studentValidations = {
    createStudentValidationSchema,
    updateStudentValidationSchema,
};
