import './App.css';
import axios from "axios";
import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";


const App = () => {

    const [listOfTodos, setListOfTodos] = useState([]);
    const [dragging, setDragging] = useState(0);
    const [newTodo, setTodo] = useState("");

    useEffect(() => {
        axios.get("http://localhost:3001/todos").then((response) => {
            setListOfTodos(response.data);
        })
    }, []);

    const createNewTodo = async (description) => {
        try {
            const response = await axios.post("http://localhost:3001/todos", {
                description: description,
            });

            setListOfTodos((prevTodos) => [...prevTodos, response.data]);
            setTodo("");
        } catch (err) {
            console.error("Failed to create a new todo", err);
        }
    }

    const handleNewTaskKeyPress = (e) => {
        if (e.key === "Enter" && newTodo.trim() !== "") {
            createNewTodo(newTodo.trim());
        }
    };

    const handleRocketClick = () => {
        if (newTodo.trim() !== "") {
            createNewTodo(newTodo.trim());
        }
    };


    const handleDragStart = (e, index) => {
        setDragging(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (index !== dragging) {
            const updatedItems = [...listOfTodos];
            const [draggedItem] = updatedItems.splice(dragging, 1);
            updatedItems.splice(index, 0, draggedItem);
            setDragging(index);
            setListOfTodos(updatedItems);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setDragging(null);

        try {
            const reorderedTodos = listOfTodos.map((todo, index) => ({
                id: todo.id,
                order_num: index + 1,
                isCompleted: todo.isCompleted
            }));

            await axios.put("http://localhost:3001/todos/reorder", {
                reorderedTodos,
            });

            setListOfTodos((prevTodos) =>
                reorderedTodos.map((orderItem) =>
                    prevTodos.find((todo) => todo.id === orderItem.id)
                )
            );
        } catch (err) {
            console.error("Failed to reorder todos", err);
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/todos/${id}`);
            setListOfTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        } catch (err) {
            console.error("Failed to delete todo", err);
        }
    };

    const handleTodoIsCompleted = (id, isCompleted) => {
        let updatedIsCompleted;
        if (isCompleted) {
            updatedIsCompleted = 0;
        } else {
            updatedIsCompleted = 1;
        }
        axios.put(`http://localhost:3001/todos/`, {id: id, isCompleted: updatedIsCompleted}).then((response) => {
            if (response.status === 200) {
                setListOfTodos((prev) => prev.map((todo) => todo.id === id ? {
                    ...todo,
                    isCompleted: updatedIsCompleted
                } : todo));
            }
        }).catch((error) => {
            console.error("There was an error updating the todo item!", error);
        });
    };

    return (
        <div className="App">
            <div>
                <div className="header">
                    <div>
                        <h1>Tasks</h1>
                    </div>

                    <div className="rocket" onClick={handleRocketClick}>🚀</div>
                </div>
                <div className="new-task">
                    <span>New Task:</span><br/>
                    <input type="text"
                           value={newTodo}
                           onChange={(e) => setTodo(e.target.value)}
                           onKeyDown={handleNewTaskKeyPress}
                    />
                </div>
                <div className="items container">
                    <ul>
                        {listOfTodos.map((item, index) => (
                            <li key={index} draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDrop={handleDrop}
                            >
                                <div className="row">
                                    <div className="checkbox">
                                        <input type="checkbox" className="checkbox"
                                               onChange={() => handleTodoIsCompleted(item.id, item.isCompleted)}
                                               checked={!!item.isCompleted}/>
                                    </div>
                                    <div
                                        className={`description ${item.isCompleted ? `completed` : ``}`}> {item.description}</div>
                                    <div className="delete-button" onClick={() => handleDeleteTodo(item.id)}>
                                        <FontAwesomeIcon icon={faTrashCan}/>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default App;
