import {response, Router} from "express";
import {buscarTarefaPorSituacao ,updateStatusTarefa, updateTarefa, getTarefaID, getTarefas, postTarefa} from "../controllers/tarefaController.js"
import { validateId } from '../helpers/validateID.js';

const router = Router();

router.get("/get-tarefas", getTarefas);
router.get('/get-tarefa/:id', validateId, getTarefaID);
router.post("/post-tarefa", postTarefa )
router.put("/update-tarefa/:id", updateTarefa)
router.patch("/update-tarefa/:id/status", updateStatusTarefa)
router.get("/get-status/:situacao", buscarTarefaPorSituacao )

export default router;