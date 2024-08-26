import {response, Router} from "express";
import {getTarefas} from "../controllers/tarefaController.js"

const router = Router();

router.get("/get-tarefas", getTarefas);

export default router;