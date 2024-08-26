import "dotenv/config";
import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 3333

const app = express();

//rotas
import tarefaRouter from "./routes/tarefaRouter.js";



//3 middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Utilização da rota (definição da url)
app.use("/", tarefaRouter);

 app.use((req, res) =>{
    res.status(404).json({ message: 'Rota não encontrada' });
 })

app.listen(PORT, () => {
    console.log(`Servidor online http://localhost:${PORT}`);
});