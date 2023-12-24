import { z } from "zod";
import { UserStatus } from "./user.constant";

const userValidationSchema = z.object({
    passwrod: z
        .string({
            invalid_type_error: "Password must be a string",
        })
        .max(20, { message: "Password can't be more than 20 characters" })
        .optional(),
});

const changeStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum([...UserStatus] as [string, ...string[]]),
    }),
});

export const UserValidation = {
    userValidationSchema,
    changeStatusValidationSchema,
};
