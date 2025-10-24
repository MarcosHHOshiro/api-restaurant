import { Request, Response, NextFunction } from 'express';
import { knex } from '@/database/knex';

class TablesSessionsController {
    async index(req: Request, res: Response, next: NextFunction) {
        try {
            return res.status(201).json({ message: "List of table sessions" });
        }
        catch (error) {
            next(error);
        }
    }
}

export { TablesSessionsController };