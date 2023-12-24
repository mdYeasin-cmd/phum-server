import express, { NextFunction, Request, Response } from "express";
import { UserControllers } from "./user.controller";
import { studentValidations } from "../student/student.validation";
import validateRequest from "../../middlewares/validateRequest";
import { createFacultyValidationSchema } from "../faculty/faculty.validation";
import { createAdminValidationSchema } from "../admin/admin.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import { UserValidation } from "./user.validation";
import { upload } from "../../utils/sendImageToCloudinary";

const router = express.Router();

router.post(
    "/create-student",
    auth(USER_ROLE.admin),
    upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
    },
    validateRequest(studentValidations.createStudentValidationSchema),
    UserControllers.createStudent,
);

/* 

{
    "password": "student123",
    "student": {
        "name": {
            "firstName": "Arafat",
            "middleName": "",
            "lastName": "Shuvo"
        },
        "gender": "female",
        "dateOfBirth": "1990-01-01",
        "email": "arafat3@gmail.com",
        "contactNo": "13232585433547",
        "emergencyContactNo": "987-654-3210",
        "bloodGroup": "A+",
        "presentAddress": "123 Main St, Cityville",
        "permanentAddress": "456 Oak St, Townsville",
        "gurdian": {
            "fatherName": "Robert Doe",
            "fatherOccupation": "Engineer",
            "fatherContactNo": "111-222-3333",
            "motherName": "Alice Doe",
            "motherOccupation": "Teacher",
            "motherContactNo": "444-555-6666"
        },
        "localGurdian": {
            "name": "Jane Smith",
            "occupation": "Doctor",
            "contactNo": "777-888-9999",
            "address": "789 Elm St, Villagetown"
        },
        "admissionSemester": "656cc43b6aa447ba33cadf03",
        "academicDepartment": "656dc8b02cbf0cb51786a3e2",
        "profileImg": "path/to/profile/image.jpg"
    }
}


*/

router.post(
    "/create-faculty",
    auth(USER_ROLE.admin),
    validateRequest(createFacultyValidationSchema),
    UserControllers.createFaculty,
);

router.post(
    "/create-admin",
    validateRequest(createAdminValidationSchema),
    UserControllers.createAdmin,
);

router.post(
    "/change-status/:id",
    auth("admin"),
    validateRequest(UserValidation.changeStatusValidationSchema),
    UserControllers.changeStatus,
);

router.get("/me", auth("admin", "faculty", "student"), UserControllers.getMe);

export const UserRoutes = router;
