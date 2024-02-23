import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicSemesterValidations } from "./academicSemester.validation";
import { AcademicSemesterControllers } from "./academicSemester.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
    "/create-semester",
    validateRequest(
        AcademicSemesterValidations.createAcademicSemesterValidationSchema,
    ),
    AcademicSemesterControllers.createAcademicSemester,
);

router.get(
    "/",
    auth("admin"),
    AcademicSemesterControllers.getAllAcadmeicSemester,
);

router.get(
    "/:facultyId",
    AcademicSemesterControllers.getSingleAcademicSemester,
);

router.patch(
    "/:facultyId",
    validateRequest(
        AcademicSemesterValidations.updateAcademicSemesterValidationSchema,
    ),
    AcademicSemesterControllers.updateSingleAcademicSemester,
);

export const AcademicSemesterRoutes = router;
