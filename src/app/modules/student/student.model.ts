import { Schema, model } from "mongoose";
import {
    TGurdian,
    TLocalGurdian,
    TStudent,
    TUserName,
    StudentModel,
} from "./student.interface";

const userNameSchema = new Schema<TUserName>({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        maxlength: [25, "First name can't be more than 25 characters"],
        trim: true,
        // validate: {
        //   validator: function (value: string) {
        //     return (
        //       value === value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        //     );
        //   },
        //   message: "{VALUE} is not capitalize format",
        // },
    },
    middleName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        // validate: {
        //   validator: function (value: string) {
        //     return validator.isAlpha(value);
        //   },
        //   message: "{VALUE} is not valid value",
        // },
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

const studentSchema = new Schema<TStudent, StudentModel>(
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
            // validate: {
            //   validator: (value: string) => validator.isEmail(value),
            //   message: "{VALUE} is not a valid email",
            // },
        },
        contactNo: {
            type: String,
            required: [true, "Contact number is required"],
            unique: true,
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
            required: true,
        },
        admissionSemester: {
            type: Schema.Types.ObjectId,
            ref: "AcademicSemester",
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
    },
);

// // query middleware
// studentSchema.pre("find", function (next) {
//     this.find({ isDeleted: { $ne: true } });

//     next();
// });

// studentSchema.pre("findOne", function (next) {
//     this.find({ isDeleted: { $ne: true } });

//     next();
// });

// studentSchema.pre("aggregate", function (next) {
//     // this.find({ isDeleted: { $ne: true } });

//     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });

//     // console.log(this.pipeline());

//     next();
// });

export const Student = model<TStudent, StudentModel>("Student", studentSchema);
