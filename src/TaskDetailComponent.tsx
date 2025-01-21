import React, { useState } from 'react';
import { Task, Alignment } from './types';

interface TaskDetailProps {
    task: Task;
    alignments: Alignment[];
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    setAlignments: React.Dispatch<React.SetStateAction<Alignment[]>>;
    deleteTask: (id: number) => void;
}

const TaskDetailComponent: React.FC<TaskDetailProps> = ({ task, alignments, tasks, setAlignments, deleteTask }) => {
    // State for the selected task to align with and alignment value
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [alignmentValue, setAlignmentValue] = useState<number>(0);

    // Filter alignments specific to this task
    const taskAlignments = alignments.filter(
        (alignment) => alignment.task1 === task.id || alignment.task2 === task.id
    );

    // Handle adding a new alignment
    const handleAddAlignment = () => {
        if (selectedTaskId === null || selectedTaskId === task.id || alignmentValue <= 0 || alignmentValue > 100) {
            alert('Please select a valid task and enter a value between 1 and 100.');
            return;
        }

        const newAlignment: Alignment = {
            id: Date.now(), // Temporary unique ID
            task1: task.id,
            task2: selectedTaskId,
            value: alignmentValue,
        };

        setAlignments((prevAlignments) => [...prevAlignments, newAlignment]);

        // Clear inputs after submission
        setSelectedTaskId(null);
        setAlignmentValue(0);
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg text-white">
            <h2 className="text-2xl mb-4">Task Details</h2>
            <p><strong>Name:</strong> {task.name}</p>
            <p><strong>Effort:</strong> {task.effort}</p>

            <h3 className="mt-4 text-lg">Alignments</h3>
            {taskAlignments.length > 0 ? (
                <ul>
                    {taskAlignments.map((alignment) => {
                        const otherTaskId = alignment.task1 === task.id ? alignment.task2 : alignment.task1;
                        const relatedTask = tasks.find(t => t.id === otherTaskId);
                        return (
                            <li key={alignment.id} className="mt-2">
                                Aligned with <strong>{relatedTask?.name}</strong>: {alignment.value}%
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>No alignments found.</p>
            )}

            <h3 className="mt-6 text-lg">Add New Alignment</h3>
            <div className="mt-2">
                <label className="block text-sm mb-1">Select Task:</label>
                <select
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    value={selectedTaskId ?? ''}
                    onChange={(e) => setSelectedTaskId(Number(e.target.value))}
                >
                    <option value="">-- Select a Task --</option>
                    {tasks
                        .filter((t) => t.id !== task.id)
                        .map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name}
                            </option>
                        ))}
                </select>
            </div>

            <div className="mt-2">
                <label className="block text-sm mb-1">Alignment Value (%):</label>
                <input
                    type="number"
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    value={alignmentValue}
                    onChange={(e) => setAlignmentValue(Number(e.target.value))}
                    min="1"
                    max="100"
                />
            </div>

            <button
                className="bg-blue-500 px-4 py-2 mt-4 rounded"
                onClick={handleAddAlignment}
            >
                Add Alignment
            </button>

            <button
                className="bg-red-500 px-4 py-2 mt-4 ml-4 rounded"
                onClick={() => deleteTask(task.id)}
            >
                Delete Task
            </button>
        </div>
    );
};

export default TaskDetailComponent;
