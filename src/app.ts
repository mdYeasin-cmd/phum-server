/* eslint-disable no-unused-vars */
import express, { Application, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// application routes
app.use("/api/v1", router);

// testing route
app.get("/", (req: Request, res: Response) => {
    // let b;

    // const a = 10;
    res.send("Hello");
});

// global error handler
app.use(globalErrorHandler);

// not found route
app.use(notFound);

export default app;
