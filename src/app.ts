/* eslint-disable no-unused-vars */
import express, { Application, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import cookieParser from "cookie-parser";

const app: Application = express();

// parsers
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: ["http://localhost:5173"],
        credentials: true,
    }),
);

// application routes
app.use("/api/v1", router);

// testing route
app.get("/", (req: Request, res: Response) => {
    res.send("PH University server is running...");
});

// global error handler
app.use(globalErrorHandler);

// not found route
app.use(notFound);

export default app;
