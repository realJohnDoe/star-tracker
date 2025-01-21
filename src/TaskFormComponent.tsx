import React from 'react';
import { Task } from './types';

interface TaskFormComponentProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    newTask: { name: string; unit: 'Hours' | 'Days' | 'Weeks' | 'Months' | 'Years' };
    setNewTask: React.Dispatch<React.SetStateAction<{ name: string; unit: 'Hours' | 'Days' | 'Weeks' | 'Months' | 'Years' }>>;
}

const TaskFormComponent: React.FC<TaskFormComponentProps> = ({ tasks, setTasks, newTask, setNewTask }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewTask((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newTaskWithId = {
            ...newTask,
            id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        };
        setTasks([...tasks, newTaskWithId]);
        setNewTask({ name: '', unit: 'hours' }); // Reset form
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-white mb-4">Add New Task</h2>

            <div className="mb-4">
                <label htmlFor="name" className="block text-white mb-2">Task Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter task name"
                    value={newTask.name}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="unit" className="block text-white mb-2">Unit of Effort</label>
                <select
                    id="unit"
                    name="unit"
                    value={newTask.unit}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                >
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                </select>
            </div>

            <button
                type="submit"
                className="w-full py-2 mt-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                Add Task
            </button>
        </form>
    );
};

export default TaskFormComponent;
