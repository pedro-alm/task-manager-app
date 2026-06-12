const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let tasks = [];
let nextId = 1;

// Listar todas as tarefas
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Criar nova tarefa
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'O título da tarefa é obrigatório.' });
  }

  const task = { id: nextId++, title: title.trim(), done: false };
  tasks.push(task);
  res.status(201).json(task);
});

// Atualizar status (concluída ou não) de uma tarefa
app.patch('/api/tasks/:id', (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ error: 'Tarefa não encontrada.' });
  }

  if (typeof req.body.done === 'boolean') {
    task.done = req.body.done;
  }

  res.json(task);
});

// Remover uma tarefa
app.delete('/api/tasks/:id', (req, res) => {
  const before = tasks.length;
  tasks = tasks.filter((t) => t.id !== Number(req.params.id));

  if (tasks.length === before) {
    return res.status(404).json({ error: 'Tarefa não encontrada.' });
  }

  res.status(204).end();
});

// Utilitário usado pelos testes para reiniciar o estado da aplicação
app.resetTasks = () => {
  tasks = [];
  nextId = 1;
};

module.exports = app;