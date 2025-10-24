import { TablesSessionsController } from "@/controllers/tables-sessions-controller";
import { Router } from "express";

const tablesSessionsRoutes = Router();
const tablesSessionsController = new TablesSessionsController();

tablesSessionsRoutes.post("/", tablesSessionsController.index);

export { tablesSessionsRoutes };