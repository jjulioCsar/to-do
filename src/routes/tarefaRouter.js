import {response, Router} from "express";
import {updateStatusTarefa, updateTarefa, getTarefaID, getTarefas, getPost} from "../controllers/tarefaController.js"
import { validateId } from '../helpers/validateID.js';

const router = Router();

router.get("/get-tarefas", getTarefas);
router.get('/get-tarefa/:id', validateId, getTarefaID);
router.post("/get-post", getPost )
router.put("/update-tarefa/:id", updateTarefa)
router.patch("/update-tarefa/:id/status", updateStatusTarefa)

export default router;