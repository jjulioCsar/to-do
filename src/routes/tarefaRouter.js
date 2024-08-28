import {response, Router} from "express";
import {getTarefas, getPost} from "../controllers/tarefaController.js"

const router = Router();

router.get("/get-tarefas", getTarefas);
router.post("/get-post", getPost )

export default router;