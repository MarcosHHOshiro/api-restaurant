import { NextFunction, Request, Response } from "express";
import { AppError } from "@/utils/AppError";

class ProductsController {
    async index(req: Request, res: Response, next: NextFunction) {
        try {
            throw new AppError("batatas", 404);

            return res.json({ message: 'ok' })
        } catch (error) {
            next(error);
        }
    }
}

export { ProductsController };