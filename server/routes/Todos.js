const express = require('express');
const router = express.Router();
const {Todos} = require('../models');

router.get('/', async (req, res) => {
    const listOfTodos = await Todos.findAll({order: [['order_num', 'ASC']]});
    res.json(listOfTodos);
});

router.post('/', async (req, res) => {
    const { description } = req.body;

    const maxOrder = await Todos.max('order_num') || 0;

    const newTodo = await Todos.create({
        description,
        order_num: maxOrder + 1,
    });
    res.json(newTodo);
});

router.put('/', async (req, res) => {
    const {listOfTodos} = req.body;
    const updatePromises = listOfTodos.map((todo, index) =>
        Todos.update({order_num: index}, {where: {id: todo.id}})
    );
});

router.delete('/', async (req, res) => {
    const {id} = req.query;
    const response = await Todos.destroy({
        where: {
            id: id,
        },
    });
    res.json(response);
});

module.exports = router;