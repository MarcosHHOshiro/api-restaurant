import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction, response } from "express";

export function errorHandling(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message })
    }

    return res.status(500).json({
        message: "Internal server error",
    });
}