import { Schema, model } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";

const userSchema = new Schema<TUser, UserModel>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: 0,
        },
        passwordChangeAt: {
            type: Date,
        },
        needsPasswordChange: {
            type: Boolean,
            default: true,
        },
        role: {
            type: String,
            enum: ["admin", "student", "faculty"],
            required: true,
        },
        status: {
            type: String,
            enum: ["in-progress", "blocked"],
            default: "in-progress",
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

// pre save middleware/hook (Document Middleware)
userSchema.pre("save", async function (next) {
    // hashing password and save into DB
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this; // this refer to document
    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds),
    );
    next();
});

// set empty after save password
userSchema.post("save", function (doc, next) {
    doc.password = "";
    next();
});

// creating a custom static method
// userSchema.statics.isUserExists = async function (id: string) {
//     const existingUser = await User.findOne({ id });
//     return existingUser;
// };

userSchema.statics.isUserExistsByCustomId = async function (id: string) {
    return await User.findOne({ id }).select("+password");
};

userSchema.statics.isPasswordMatched = async function (
    plainTextPassword,
    hashedPassword,
) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = async function (
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
) {
    const passwordChangeTime =
        new Date(passwordChangedTimestamp).getTime() / 1000;

    return passwordChangeTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>("User", userSchema);
