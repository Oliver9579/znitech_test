const express = require('express');
const router = express.Router();
const {Todos} = require('../models');

router.get('/', async (req, res) => {
    try {
        const listOfTodos = await Todos.findAll({order: [['order_num', 'ASC']]});
        res.status(200).json(listOfTodos);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to fetch todos."});
    }
});

router.post('/', async (req, res) => {
    const {description} = req.body;

    if (!description) {
        return res.status(400).json({error: "Description is required."});
    }

    try {
        const maxOrder = (await Todos.max('order_num')) || 0;
        const newTodo = await Todos.create({
            description,
            order_num: maxOrder + 1,
        });
        res.status(201).json(newTodo);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to create todo."});
    }
});

router.put('/', async (req, res) => {
    const {listOfTodos} = req.body;
    if (!Array.isArray(listOfTodos)) {
        return res.status(400).json({error: "listOfTodos must be an array."});
    }

    try {
        const updatePromises = listOfTodos.map((todo, index) =>
            Todos.update({order_num: index}, {where: {id: todo.id}})
        );
        await Promise.all(updatePromises);
        res.status(200).json({message: "Todos order updated successfully."});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to update todos order."});
    }
});

router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    if (!id) {
        return res.status(400).json({error: "ID parameter is required."});
    }

    try {
        const rowsDeleted = await Todos.destroy({
            where: {
                id: id,
            },
        });

        if (rowsDeleted === 0) {
            return res.status(404).json({error: "Todo not found."});
        }

        res.status(200).json({message: "Todo deleted successfully."});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to delete todo."});
    }
});

module.exports = router;