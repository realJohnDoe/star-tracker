import React from 'react';
import { Task } from './types';

interface TaskFormComponentProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    newTask: { name: string; effort: number };
    setNewTask: React.Dispatch<React.SetStateAction<{ name: string; effort: number }>>;
}

const TaskFormComponent: React.FC<TaskFormComponentProps> = ({
    tasks,
    setTasks,
    newTask,
    setNewTask,
}) => {
    const addTask = () => {
        if (!newTask.name || newTask.effort <= 0) {
            alert('Please enter valid task details');
            return;
        }
        const newId = tasks.length + 1;
        const newTaskData: Task = { id: newId, name: newTask.name, effort: newTask.effort };
        setTasks([...tasks, newTaskData]);
        setNewTask({ name: '', effort: 0 });
    };

    return (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl mb-4 text-center text-white">Create Task</h2>
            <input
                type="text"
                className="border border-gray-400 p-3 w-full mb-4 rounded-lg"
                placeholder="Task Name"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            />
            <input
                type="number"
                className="border border-gray-400 p-3 w-full mb-4 rounded-lg"
                placeholder="Effort"
                value={newTask.effort}
                onChange={(e) => setNewTask({ ...newTask, effort: parseInt(e.target.value) })}
            />
            <button
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 w-full rounded-lg"
                onClick={addTask}
            >
                Add Task
            </button>
        </div>
    );
};

export default TaskFormComponent;
