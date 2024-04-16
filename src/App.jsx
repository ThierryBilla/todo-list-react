import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css'; 

function App() {
  const LSKEY = "MyTodoApp"; 


  const initialTodos = JSON.parse(window.localStorage.getItem(LSKEY + ".todos")) || [];
  const [todos, setTodos] = useState(initialTodos);


  const addTodo = (text) => {
    const newTodo = { id: uuidv4(), text, completed: false }; 
    setTodos([...todos, newTodo]);
  };

  // set todo as done
  const toggleTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  // useEffect saves in localStorage
  useEffect(() => {
    window.localStorage.setItem(LSKEY + ".todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <div className="App">
      <header>
        <h1>My Todo List</h1>
      </header>
      <TodoForm addTodo={addTodo} />
      <TodoList todos={todos} toggleTodo={toggleTodo} />
    </div>
  );
}

function TodoForm({ addTodo }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addTodo(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter a new todo"
      />
      <div>
        <button type="submit">Add Todo</button>
      </div>
      
    </form>
  );
}

function TodoList({ todos, toggleTodo }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>
          <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(index)} />
          <span className={todo.completed ? 'completed' : ''}>
            {todo.text}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default App;
