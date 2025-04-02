import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodoList.css';

const TodoList = () => {
    const [todo, setTodo] = useState({
        title: "",
    });
    const [todos, setTodos] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get("http://localhost:3001/item");
            setTodos(response.data);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    const handleChange = (e) => {
        setTodo({ ...todo, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`http://localhost:3001/item/${editingId}`, todo);
                alert("Todo updated successfully!");
            } else {
                await axios.post("http://localhost:3001/item", todo);
                alert("Todo added successfully!");
            }
            setTodo({ title: "" });
            setEditingId(null);
            setIsEditing(false);
            fetchTodos();
        } catch (error) {
            console.error("Error saving todo:", error);
            alert(isEditing ? "Failed to update todo." : "Failed to add todo.");
        }
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/item/${id}`);
            fetchTodos();
            alert("Todo deleted successfully!");
        } catch (error) {
            console.error("Error deleting todo:", error);
            alert("Failed to delete todo.");
        }
    }

    const handleEdit = (item) => {
        setTodo({ title: item.title });
        setEditingId(item._id);
        setIsEditing(true);
    }

    return (
        <div className="form-container">
            <div className="overlay">
                <div className="form-box">
                    <h2>{isEditing ? 'Edit Todo' : 'Add New Todo'}</h2>
                    <form onSubmit={handleSubmit}>
                        <label>Title:</label>
                        <input 
                            type="text" 
                            placeholder="Enter todo title" 
                            value={todo.title} 
                            onChange={handleChange} 
                            name="title" 
                            required 
                        />
                        <div className="form-buttons">
                            <button type="submit">
                                {isEditing ? 'Update' : 'Submit'}
                            </button>
                            {isEditing && (
                                <button 
                                    type="button" 
                                    className="cancel-btn"
                                    onClick={() => {
                                        setTodo({ title: "" });
                                        setEditingId(null);
                                        setIsEditing(false);
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="todos-list">
                        <h3>Todo List</h3>
                        {todos.map((item) => (
                            <div key={item._id} className="todo-item">
                                <div className="todo-content">
                                    <div className="todo-info">
                                        <span className="todo-title">{item.title}</span>
                                        <span className="todo-date">
                                            Submitted: {new Date(item.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="todo-actions">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => handleEdit(item)}
                                            disabled={isEditing}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDelete(item._id)}
                                            disabled={isEditing}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoList; 