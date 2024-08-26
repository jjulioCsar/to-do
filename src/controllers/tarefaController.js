import Tarefa from "../models/tarefaModel.js";

export const getTarefas = async (req, res) => {
    try {
        const tarefas = await Tarefa.findAll();
        res.status(200).json(tarefas);
    } catch (error) {
        res.status(500).json({ error: "Failed find tasks" });
    }
};

export const getPost = async (req, res) => {
    const { tarefa, descricao } = req.body;
    const status = "pendente";

    if(!tarefa){
        res.status(404).json({ error: "task is mandatory" });
        return;
    }
    if(!descricao){
        res.status(404).json({ error: "description is mandatory" });
        return;
    }

    const newTask = {
        tarefa,
        descricao,
        status
    }
    try{
        await Tarefa.create(newTask);
        res.status(201).json(newTask);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to create task" });
    }
};