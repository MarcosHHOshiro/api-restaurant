import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/AppError';
import { knex } from '@/database/knex';
import z from 'zod';

class TablesSessionsController {
    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                table_id: z.number(),
            });

            const { table_id } = bodySchema.parse(req.body);

            const session = await knex<TablesSessionsRepository>('tables_sessions')
                .where({ table_id }).orderBy('opened_at', 'desc').first();

            if (session && !session.closed_at) {
                throw new AppError('There is already an open session for this table.', 400);
            }

            await knex<TablesSessionsRepository>('tables_sessions').insert({
                table_id,
                opened_at: knex.fn.now(),
            });

            return res.status(201).json({ message: "Table session created successfully" });
        }
        catch (error) {
            next(error);
        }
    }
}

export { TablesSessionsController };