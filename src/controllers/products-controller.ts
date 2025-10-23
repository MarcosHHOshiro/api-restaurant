import { NextFunction, Request, Response } from "express";
import { AppError } from "@/utils/AppError";

class ProductsController {
    async index(req: Request, res: Response, next: NextFunction) {
        try {

            return res.json({ message: 'ok' })
        } catch (error) {
            next(error);
        }
    }
}

export { ProductsController };