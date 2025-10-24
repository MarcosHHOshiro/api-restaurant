import { NextFunction, Request, Response } from "express";
import { knex } from "@/database/knex";
import { AppError } from "@/utils/AppError";
import { z } from "zod";

class ProductsController {
    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.query

            const products = await knex("products").select().whereLike("name", `%${name}%`)


            return res.json({ message: products })
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

            await knex<ProductRespository>("products").insert({
                name,
                price
            })

            return res.status(201).json({ message: 'Product created' });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = z.string().transform(Number).refine((value) => !isNaN(value)).parse(req.params.id);

            const bodySchema = z.object({
                name: z.string().trim().min(6),
                price: z.number().gt(0, { message: "Price must be greater than zero" }),
            })

            const { name, price } = bodySchema.parse(req.body);

            const product = await knex<ProductRespository>("products").where({ id }).first();
            if (!product) {
                throw new AppError('Product not found', 404);
            }

            await knex<ProductRespository>("products").where({ id }).update({
                name,
                price,
                updated_at: knex.fn.now()
            })

            return res.json({ message: 'update product' });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = z.string().transform(Number).refine((value) => !isNaN(value)).parse(req.params.id);

            const product = await knex<ProductRespository>("products").where({ id }).first();

            if (!product) {
                throw new AppError('Product not found', 404);
            }

            await knex<ProductRespository>("products").where({ id }).delete();

            return res.json({ message: 'Product deleted' });
        } catch (error) {
            next(error);
        }
    }
}

export { ProductsController };