import { Schema, model } from "mongoose";
import {
    TGurdian,
    TLocalGurdian,
    TStudent,
    TUserName,
} from "./student.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const userNameSchema = new Schema<TUserName>({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        maxlength: [25, "First name can't be more than 25 characters"],
        trim: true,
    },
    middleName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
    },
});

const gurdianSchema = new Schema<TGurdian>({
    fatherName: {
        type: String,
        required: [true, "Father's name is required"],
    },
    fatherOccupation: {
        type: String,
        required: [true, "Father's occupation is required"],
    },
    fatherContactNo: {
        type: String,
        required: [true, "Father's contact number is required"],
    },
    motherName: {
        type: String,
        required: [true, "Mother's name is required"],
    },
    motherOccupation: {
        type: String,
        required: [true, "Mother's occupation is required"],
    },
    motherContactNo: {
        type: String,
        required: [true, "Mother's contact number is required"],
    },
});

const localGurdianSchema = new Schema<TLocalGurdian>({
    name: {
        type: String,
        required: [true, "Local guardian's name is required"],
    },
    occupation: {
        type: String,
        required: [true, "Local guardian's occupation is required"],
    },
    contactNo: {
        type: String,
        required: [true, "Local guardian's contact number is required"],
    },
    address: {
        type: String,
        required: [true, "Local guardian's address is required"],
    },
});

const studentSchema = new Schema<TStudent>(
    {
        id: {
            type: String,
            required: [true, "Student ID is required"],
            unique: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            required: [true, "User id is required"],
            unique: true,
            ref: "User",
        },
        name: {
            type: userNameSchema,
            required: [true, "Student name is required"],
        },
        gender: {
            type: String,
            enum: {
                values: ["male", "female", "other"],
                message: "{VALUE} is not valid",
            },
            required: [true, "Gender is required"],
        },
        dateOfBirth: {
            type: Date,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
        },
        contactNo: {
            type: String,
            required: [true, "Contact number is required"],
            // unique: true,
        },
        emergencyContactNo: {
            type: String,
            required: [true, "Emergency contact number is required"],
        },
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        },
        presentAddress: {
            type: String,
            required: [true, "Present address is required"],
        },
        permanentAddress: {
            type: String,
            required: [true, "Permanent address is required"],
        },
        gurdian: {
            type: gurdianSchema,
            required: [true, "Guardian information is required"],
        },
        localGurdian: {
            type: localGurdianSchema,
            required: [true, "Local guardian information is required"],
        },
        profileImg: {
            type: String,
            default: "",
        },
        admissionSemester: {
            type: Schema.Types.ObjectId,
            ref: "AcademicSemester",
        },
        academicDepartment: {
            type: Schema.Types.ObjectId,
            ref: "AcademicDepartment",
        },
        academicFaculty: {
            type: Schema.Types.ObjectId,
            ref: "AcademicFaculty",
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    },
);

//virtual
studentSchema.virtual("fullName").get(function () {
    return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

studentSchema.pre("findOneAndUpdate", async function (next) {
    // this keyword available only "save" method
    const query = this.getQuery();

    const isStudentExist = await Student.findOne(query);

    if (!isStudentExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "This student not exists");
    }

    next();
});

export const Student = model<TStudent>("Student", studentSchema);
