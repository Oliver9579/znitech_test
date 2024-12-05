import './App.css';
import axios from "axios";
import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashCan} from "@fortawesome/free-solid-svg-icons";


const App = () => {

    const [listOfTodos, setListOfTodos] = useState([]);
    const [dragging, setDragging] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:3001/todos").then((response) => {
            setListOfTodos(response.data);
        })
    }, []);

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

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(null);

    };


    return (
        <div className="App">
            <div>
                <div className="header">
                    <div>
                        <h1>Tasks</h1>
                    </div>

                    <div className="rocket">🚀</div>
                </div>
                <div className="new-task">
                    <span>New Task:</span><br/>
                    <input type="text"/>
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
                                        <input type="checkbox" className="checkbox"/>
                                    </div>
                                    <div className="description"> {item.description}</div>
                                    <div className="delete-button"><FontAwesomeIcon icon={faTrashCan}/></div>
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
