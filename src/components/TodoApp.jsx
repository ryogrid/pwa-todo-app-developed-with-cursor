import { useState, useEffect } from 'react';
import { TodoDb } from '../services/todoDb';

export default function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    useEffect(() => {
        loadTodos();
    }, []);

    const loadTodos = async () => {
        const loadedTodos = await TodoDb.getAllTodos();
        setTodos(loadedTodos);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        await TodoDb.addTodo({ text: newTodo });
        setNewTodo('');
        loadTodos();
    };

    const toggleTodo = async (todo) => {
        const updatedTodo = { ...todo, completed: !todo.completed };
        await TodoDb.updateTodo(updatedTodo);
        loadTodos();
    };

    const deleteTodo = async (id) => {
        await TodoDb.deleteTodo(id);
        loadTodos();
    };

    return (
        <div className="todo-app">
            <h1>Todo App</h1>
            
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="What needs to be done?"
                />
                <button type="submit">Add Todo</button>
            </form>

            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo)}
                        />
                        <span style={{ 
                            textDecoration: todo.completed ? 'line-through' : 'none' 
                        }}>
                            {todo.text}
                        </span>
                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
} 