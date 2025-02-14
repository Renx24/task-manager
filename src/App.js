import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [task, setTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Add new task
  const addTask = () => {
    if (task.trim() === "") return;
    setTasks([...tasks, { text: task, completed: false }]);
    setTask("");
  };

  // Toggle task completion
  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  // Delete a task
  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  // Start editing a task
  const startEditing = (index) => {
    setEditIndex(index);
    setEditText(tasks[index].text);
  };

  // Save the edited task
  const saveEdit = (index) => {
    if (editText.trim() === "") return;
    const newTasks = [...tasks];
    newTasks[index].text = editText;
    setTasks(newTasks);
    setEditIndex(null);
  };

  // Handle Enter/Escape keys while editing
  const handleEditKeyDown = (e, index) => {
    if (e.key === "Enter") {
      saveEdit(index);
    } else if (e.key === "Escape") {
      setEditIndex(null);
    }
  };

  return (
    <div className="app">
      <h1>Task Manager</h1>
      <div className="task-input">
        <input
          type="text"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>Add</button>
      </div>
      <ul>
        {tasks.map((t, index) => (
          <li key={index} className={t.completed ? "completed" : ""}>
            {editIndex === index ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => setTimeout(() => saveEdit(index), 100)} // Save after 100ms to prevent flickering
                onKeyDown={(e) => handleEditKeyDown(e, index)}
                autoFocus
              />
            ) : (
              <span onClick={() => toggleTask(index)}>{t.text}</span>
            )}
            <div className="buttons">
              {editIndex === index ? (
                <button onClick={() => saveEdit(index)}>💾</button> // Save button
              ) : (
                <button onClick={() => startEditing(index)}>✏️</button> // Edit button
              )}
              <button onClick={() => deleteTask(index)}>❌</button> {/* Delete button */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
