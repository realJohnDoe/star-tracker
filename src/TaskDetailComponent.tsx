import React, { useState } from 'react';
import { Task, Alignment } from './types';

interface TaskDetailComponentProps {
    task: Task;
    tasks: Task[];
    alignments: Alignment[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    setAlignments: React.Dispatch<React.SetStateAction<Alignment[]>>;
    deleteTask: (id: number) => void;
}

const TaskDetailComponent: React.FC<TaskDetailComponentProps> = ({
    task,
    tasks,
    alignments,
    setTasks,
    setAlignments,
    deleteTask
}) => {
    const [alignmentValue, setAlignmentValue] = useState<number | string>('');
    const [secondTask, setSecondTask] = useState<Task | null>(null);

    // Add an alignment between two tasks
    const addAlignment = (task1: Task, task2: Task, value: number) => {
        const newAlignment: Alignment = {
            id: alignments.length + 1,
            task1: task1.id,
            task2: task2.id,
            value
        };
        const updatedAlignments = [...alignments, newAlignment];
        setAlignments(updatedAlignments);
        localStorage.setItem('alignments', JSON.stringify(updatedAlignments)); // Save alignments to localStorage
    };

    const handleAddAlignment = () => {
        if (task && secondTask && alignmentValue && !isNaN(Number(alignmentValue))) {
            addAlignment(task, secondTask, parseInt(alignmentValue as string));
            setAlignmentValue('');
        } else {
            alert('Please select a second task and enter a valid alignment value.');
        }
    };

    // Filter tasks to exclude the current task from the dropdown options
    const availableTasks = tasks.filter((t) => t.id !== task.id);

    return (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl mb-4 text-center text-white">Task Details: {task.name}</h2>
            <p className="text-white mb-4">Effort: {task.effort}</p>

            <div className="flex mb-4">
                <button
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg w-full"
                    onClick={() => deleteTask(task.id)}
                >
                    Delete Task
                </button>
            </div>

            <h3 className="text-xl text-white mb-4">Add Alignment</h3>
            <div className="mb-4">
                {/* Only show the dropdown if there are other tasks to align */}
                {availableTasks.length > 0 ? (
                    <>
                        <select
                            className="border border-gray-400 p-3 w-full mb-4 rounded-lg"
                            onChange={(e) => setSecondTask(tasks.find((task) => task.id === parseInt(e.target.value)) || null)}
                        >
                            <option value="">Select Task to Align</option>
                            {availableTasks.map((task) => (
                                <option key={task.id} value={task.id}>
                                    {task.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            className="border border-gray-400 p-3 w-full mb-4 rounded-lg"
                            placeholder="Alignment Value"
                            value={alignmentValue || ''}
                            onChange={(e) => setAlignmentValue(e.target.value)}
                        />
                        <button
                            className="bg-green-500 hover:bg-green-600 text-white p-3 w-full rounded-lg"
                            onClick={handleAddAlignment}
                        >
                            Add Alignment
                        </button>
                    </>
                ) : (
                    <p className="text-white">No other tasks available to align with.</p>
                )}
            </div>

            <div>
                <h4 className="text-xl text-white mb-2">Existing Alignments:</h4>
                {alignments
                    .filter((alignment) => alignment.task1 === task.id || alignment.task2 === task.id)
                    .map((alignment) => (
                        <p key={alignment.id} className="text-white mb-2">
                            Task {alignment.task1 === task.id ? alignment.task2 : alignment.task1} - Value: {alignment.value}
                        </p>
                    ))}
            </div>
        </div>
    );
};

export default TaskDetailComponent;
