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
    const {id, isCompleted} = req.body;
    try {
        await Todos.update({isCompleted: isCompleted}, {where: {id}});
        res.status(200).json({message: "Todo updated successfully."});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to update todo."});
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

router.put('/reorder', async (req, res) => {
    const {reorderedTodos} = req.body;

    if (!Array.isArray(reorderedTodos)) {
        return res.status(400).json({error: "Invalid input format."});
    }

    try {
        for (const todo of reorderedTodos) {

            await Todos.update({order_num: todo.order_num}, {where: {id: todo.id}});
        }

        res.status(200).json({message: "Todos reordered successfully."});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to reorder todos."});
    }
});

module.exports = router;