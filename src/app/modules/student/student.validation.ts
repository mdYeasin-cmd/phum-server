import { z } from "zod";

// Define validation schema for userName
const userNameValidationSchema = z.object({
    firstName: z
        .string()
        .min(1)
        .max(25)
        .refine((value) => /^[A-Z]/.test(value), {
            message: "First Name must be start with capital letter",
        }),
    middleName: z.string().optional(),
    lastName: z.string(),
});

// Define validation schema for gurdian
const gurdianValidationSchema = z.object({
    fatherName: z.string(),
    fatherOccupation: z.string(),
    fatherContactNo: z.string(),
    motherName: z.string(),
    motherOccupation: z.string(),
    motherContactNo: z.string(),
});

// Define validation schema for localGurdian
const localGurdianValidationSchema = z.object({
    name: z.string(),
    occupation: z.string(),
    contactNo: z.string(),
    address: z.string(),
});

// Define validation schema for student
const createStudentValidationSchema = z.object({
    body: z.object({
        password: z.string().max(25),
        student: z.object({
            name: userNameValidationSchema,
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
            gurdian: gurdianValidationSchema,
            localGurdian: localGurdianValidationSchema,
            admissionSemester: z.string(),
            profileImg: z.string(),
        }),
    }),
});

export const studentValidations = {
    createStudentValidationSchema,
};
