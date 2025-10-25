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

            const session = await knex<TablesSessionsRepository>("tables_sessions")
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

            await knex<OrderRepository>("orders").insert({
                table_session_id,
                product_id,
                quantity,
                price: product.price
            });

            return res.status(201).json({ message: 'Order created' });
        }
        catch (error) {
            next(error);
        }
    }

    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const { table_session_id } = req.params;

            const orders = await knex<OrderRepository>("orders")
                .where({ table_session_id: Number(table_session_id) })
                .select("orders.id", "orders.table_session_id", "orders.quantity", "orders.price", "products.name as product_name")
                .join("products", "orders.product_id", "products.id");

            return res.status(200).json(orders);
        } catch (error) {
            next(error);
        }
    }

    async show(req: Request, res: Response, next: NextFunction) {
        try {
            const { table_session_id } = req.params;

            const total = await knex<OrderRepository>("orders")
                .select(knex.raw("SUM(quantity * price) as total"))
                .where({ table_session_id: Number(table_session_id) })
                .first();

            if (!total) {
                throw new AppError("Order not found", 404);
            }

            return res.status(200).json(total);
        } catch (error) {
            next(error);
        }
    }
}

export { OrdersController };