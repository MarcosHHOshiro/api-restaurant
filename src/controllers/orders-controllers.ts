import { NextFunction, Request, Response } from "express";
import { knex } from "@/database/knex";
import { AppError } from "@/utils/AppError";
import { z } from "zod";

class OrdersController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                table_session_id: z.number().int().positive(),
                product_id: z.number().int().positive(),
                quantity: z.number().int().positive().default(1),
            })

            const { table_session_id, product_id, quantity } = bodySchema.parse(req.body);

            const session = await knex<TablesSessionsRepository>("table_sessions")
                .where({ id: table_session_id })
                .first();

            if (!session) {
                throw new AppError("Table session not found", 404);
            }

            const product = await knex<ProductRespository>("products")
                .where({ id: product_id })
                .first();

            if (!product) {
                throw new AppError("Product not found", 404);
            }

            return res.status(201).json({ message: 'Order created' });
        }
        catch (error) {
            next(error);
        }
    }
}

export { OrdersController };