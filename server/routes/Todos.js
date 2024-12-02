const express = require('express');
const router = express.Router();
const {Todos} = require('../models');

router.get('/', async (req, res) => {
    const listOfTodos = await Todos.findAll();
    res.json(listOfTodos);
});

router.post('/', async (req, res) => {
    const todo = req.body;
    await Todos.create(todo);
    res.json(todo);
});

module.exports = router;