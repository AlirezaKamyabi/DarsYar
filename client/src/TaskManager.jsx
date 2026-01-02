import { useState, useEffect } from 'react';
import axios from 'axios';

const TaskManager = ({ courseId }) => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState('');

    useEffect(() => {
        fetchTasks();
    }, [courseId]);

    const fetchTasks = async () => {
        const { data } = await axios.get(`http://localhost:5000/api/tasks/${courseId}`);
        setTasks(data);
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:5000/api/tasks', { title, deadline, courseId });
        setTitle('');
        setDeadline('');
        fetchTasks(); // Refresh list
    };

    const toggleStatus = async (taskId) => {
        await axios.put(`http://localhost:5000/api/tasks/${taskId}`);
        fetchTasks();
    };

    return (
        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#fff3cd', borderRadius: '10px', border: '1px solid #ffeeba' }}>
            <h3 style={{ color: '#856404' }}>📝 Assignments & Deadlines</h3>
            
            {/* Add Task Form */}
            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input 
                    type="text" placeholder="Task Name (e.g. Project Phase 1)" 
                    value={title} onChange={(e) => setTitle(e.target.value)} required 
                    style={{ flex: 2, padding: '8px' }}
                />
                <input 
                    type="date" 
                    value={deadline} onChange={(e) => setDeadline(e.target.value)} required 
                    style={{ flex: 1, padding: '8px' }}
                />
                <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#ffc107', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Add</button>
            </form>

            {/* Task List */}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {tasks.map(task => (
                    <li key={task._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'white', marginBottom: '5px', borderRadius: '5px' }}>
                        <span style={{ textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>
                            {task.title} <small style={{ color: 'red' }}>({new Date(task.deadline).toLocaleDateString()})</small>
                        </span>
                        <button 
                            onClick={() => toggleStatus(task._id)}
                            style={{ fontSize: '12px', cursor: 'pointer' }}>
                            {task.status === 'Pending' ? '⬜ Mark Done' : '✅ Completed'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskManager;