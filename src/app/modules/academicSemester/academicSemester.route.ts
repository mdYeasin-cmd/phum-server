import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicSemesterValidations } from "./academicSemester.validation";
import { AcademicSemesterControllers } from "./academicSemester.controller";

const router = express.Router();

router.post(
    "/create-semester",
    validateRequest(
        AcademicSemesterValidations.createAcademicSemesterValidationSchema,
    ),
    AcademicSemesterControllers.createAcademicSemester,
);

router.get("/", AcademicSemesterControllers.getAllAcadmeicSemester);

router.get(
    "/:semesterId",
    AcademicSemesterControllers.getSingleAcademicSemester,
);

router.patch(
    "/:semesterId",
    validateRequest(
        AcademicSemesterValidations.updateAcademicSemesterValidationSchema,
    ),
    AcademicSemesterControllers.updateSingleAcademicSemester,
);

export const AcademicSemesterRoutes = router;
