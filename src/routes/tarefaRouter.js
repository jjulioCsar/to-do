import {response, Router} from "express";
import { getPost} from "../controllers/tarefaController.js"

const router = Router();


router.post("/get-post", getPost )

export default router;