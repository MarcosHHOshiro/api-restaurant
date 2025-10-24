import { NextFunction, Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { z } from "zod";

class ProductsController {
    async index(req: Request, res: Response, next: NextFunction) {
        try {

            return res.json({ message: 'ok' })
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                name: z.string().trim().min(6),
                price: z.number().gt(0, { message: "Price must be greater than zero" }),
            })

            const { name, price } = bodySchema.parse(req.body);
 
            return res.status(201).json({ message: 'Product created' });
        } catch (error) {
            next(error);
        }
    }
}

export { ProductsController };