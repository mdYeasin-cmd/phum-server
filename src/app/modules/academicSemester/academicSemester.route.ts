import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicSemesterValidations } from "./academicSemester.validation";
import { AcademicSemesterControllers } from "./academicSemester.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post(
    "/create-semester",
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
        AcademicSemesterValidations.createAcademicSemesterValidationSchema,
    ),
    AcademicSemesterControllers.createAcademicSemester,
);

router.get(
    "/",
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.faculty,
        USER_ROLE.student,
    ),
    AcademicSemesterControllers.getAllAcadmeicSemester,
);

router.get(
    "/:facultyId",
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.faculty,
        USER_ROLE.student,
    ),
    AcademicSemesterControllers.getSingleAcademicSemester,
);

router.patch(
    "/:facultyId",
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
        AcademicSemesterValidations.updateAcademicSemesterValidationSchema,
    ),
    AcademicSemesterControllers.updateSingleAcademicSemester,
);

export const AcademicSemesterRoutes = router;
