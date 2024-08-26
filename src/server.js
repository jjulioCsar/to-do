import "dotenv/config";
import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 3333

// import connection from database (to-do)
import dbConnection from "./config/dbConnection.js"

const app = express();

//rotas
import tarefaRouter from "./routes/tarefaRouter.js";

//3 middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// connection from database (to-do)
dbConnection.sync().then(()=>{
    app.listen(PORT, () => {
        console.log(`Servidor online http://localhost:${PORT}`);
    });
});


//utility for router(definition of routes)
app.use("/", tarefaRouter);

 app.use((req, res) =>{
    res.status(404).json({ message: 'Route not found' });
 })

