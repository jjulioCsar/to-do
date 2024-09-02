import Tarefa from "../models/tarefaModel.js";
import { validationResult } from "express-validator";
import {z} from "zod";

import formatZodError from "../helpers/zodError.js";

//Query (optional) - Params (mandatory)
//tasks?page=1&limit=10
//req.params.limit --> to retrieve all registered items, must be changed

//validações com ZOD
//validação post
const createSchema = z.object({
  tarefa: z.string().min(3, {msg: "A tarefa deve ter pelo menos 3 caracteres"}).transform((txt) =>txt.toLowerCase()),
  descricao: z.string().min(10, {msg: "A descricao deve ter pelo menos 10 caracteres"}),
})
//validação get
const getSchemaID = z.object({
  id: z.string().uuid(),
})
//validação do update
const updateSchema = z.object({
  tarefa: z.string().min(3, {msg: "A tarefa deve ter pelo menos 3 caracteres"}).transform((txt) => txt.toLowerCase()),
  descricao: z.string().min(10, {msg: "A descricao deve ter pelo menos 10 caracteres"}),
  status: z.enum(["pendente", "concluída"]),
})
const paramsSchema = z.object({
  id: z.string().uuid(),
})

//puxar tarefas
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

// Postar tarefa
export const postTarefa = async (req, res) => {
  const bodyValidation = createSchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res.status(400).json({ 
      msg: "Os dados recebidos do corpo da requisição são inválidos", 
      detalhes: formatZodError (bodyValidation.error) 
    });
  }

  const { tarefa, descricao } = req.body;
  const status = "pendente";

  // Validação dos campos obrigatórios
  if (!tarefa) {
    return res.status(400).json({ error: "Task is mandatory" });
  }
  if (!descricao) {
    return res.status(400).json({ error: "Description is mandatory" });
  }

  const newTask = { tarefa, descricao, status };

  try {
    // Criação da nova tarefa
    await Tarefa.create(newTask);
    return res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({ error: "Failed to create task" });
  }
};

//puxar tarefa por ID
export const getTarefaID = async (req, res) => {
  const bodyValidation = getSchemaID.safeParse(req.params);
  if (!bodyValidation.success) {
    return res.status(400).json({ 
      msg: "Os dados recebidos do corpo da requisição são inválidos", 
      detalhes: formatZodError (bodyValidation.error) 
    });
  }
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

//atualizar tarefa por ID
export const updateTarefa = async (req, res) => {
  
const bodyValidation = updateSchema.safeParse(req.body);
if (!bodyValidation.success) {
  return res.status(400).json({ 
    msg: "Os dados recebidos do corpo da requisição são inválidos", 
    detalhes: formatZodError(bodyValidation.error) 
  });
}
const paramsValidation = paramsSchema.safeParse(req.params);
if (!paramsValidation.success) {
  return res.status(400).json({ 
    msg: "Os dados recebidos na URL são inválidos", 
    detalhes: formatZodError(paramsValidation.error) 
  });
} 

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

//atualizar status de tarefa por id
export const  updateStatusTarefa = async (req, res) => {
  const { id } = req.params;
  
  try{
    const tarefa = await Tarefa.findOne({ raw: true, where: { id } });
    if(tarefa === null){
      return res.status(404).json({ error: "Task not found" });
    }
    if(tarefa.status === "pendente"){
      await Tarefa.update({ status: "concluída" }, { where: { id } });
    }else if(tarefa.status === "concluída"){
      await Tarefa.update({ status: "pendente" }, { where: { id } });
    }
    
    const taskAtualizada = await Tarefa.findOne({ raw: true, where: { id } });
    res.status(200).json(taskAtualizada);
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to find task" });
    return;
    }

};

//buscar tarefas por status
export const buscarTarefaPorSituacao = async (req, res) => {
  const { situacao } = req.params;

  if (situacao !== "pendente" && situacao !== "concluída") {
    return res.status(400).json({ error: "Invalid situation, use 'pendente' or 'concluída'" });
  }

  try {
    const tasks = await Tarefa.findAll({ where: { status: situacao }, raw: true });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error finding tasks by situation:", error);
    res.status(500).json({ error: "Failed to find tasks" });
  }
};

