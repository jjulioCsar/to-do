import Tarefa from "../models/tarefaModel.js";
import { validationResult } from "express-validator";

//Query (optional) - Params (mandatory)
//tasks?page=1&limit=10
//req.params.limit --> to retrieve all registered items, must be changed
export const getTarefas = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  try {
    const tasks = await Tarefa.findAndCountAll({
      limit,
      offset,
    });
    const totalPages = Math.ceil(tasks.count / limit);
    res.status(200).json({
      totalTasks: tasks.count,
      totalPages,
      pageActual: page,
      itemsForPage: limit,
      nextPage:
        totalPages === 0
          ? null
          : `http://localhost:3333/tarefas?page=${page + 1}`,
      tasks: tasks.rows,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error in listing tasks" });
  }
};

export const getPost = async (req, res) => {
  const { tarefa, descricao } = req.body;
  const status = "pendente";

  if (!tarefa) {
    res.status(404).json({ error: "task is mandatory" });
    return;
  }
  if (!descricao) {
    res.status(404).json({ error: "description is mandatory" });
    return;
  }

  const newTask = {
    tarefa,
    descricao,
    status,
  };
  try {
    await Tarefa.create(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

export const getTarefaID = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const tarefa = await Tarefa.findOne({ where: { id } });

    if (!tarefa) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(tarefa);
  } catch (error) {
    console.error("Error in retrieving task by ID:", error);
    res.status(500).json({ error: "Failed to find task" });
  }
};

export const updateTarefa = async (req, res) => {
  const { id } = req.params;
  const { tarefa, descricao, status } = req.body;

  //validations
  if (!tarefa) {
    res.status(404).json({ error: "task is mandatory" });
    return;
  }
  if (!descricao) {
    res.status(404).json({ error: "description is mandatory" });
    return;
  }
  if (!status) {
    res.status(404).json({ error: "status is mandatory" });
    return;
  }

  const tarefaAtualizada = {
    tarefa,
    descricao,
    status,
  };
  console.log(tarefaAtualizada);

  try {
    await Tarefa.update(tarefaAtualizada, { where: { id } });
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update task" });
  }
};
