import React, { useState } from 'react';
import { Task, Alignment } from './types';

interface TaskVectorVisualizationProps {
    tasks: Task[];
    alignments: Alignment[];
    selectedTask: Task | null;
    setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
}

const TaskVectorVisualization: React.FC<TaskVectorVisualizationProps> = ({
    tasks,
    alignments,
    selectedTask,
    setSelectedTask,
}) => {
    if (!selectedTask) return <div className="text-white">Select a task to visualize.</div>;

    // Constants for scaling vectors based on units
    const BASE_UNIT_IN_PIXELS = 30; // Base unit for hours
    const UNIT_SCALE = {
        Hours: 1,
        Days: 2,
        Weeks: 3,
        Months: 4,
        Years: 5,
    };

    const SCALE_FACTOR = 1; // Overall scaling to keep vectors manageable

    // Helper function to get the magnitude of the vector based on the unit
    const getMagnitude = (effort: number, unit: 'Hours' | 'Days' | 'Weeks' | 'Months' | 'Years') => {
        const unitInPixels = BASE_UNIT_IN_PIXELS * UNIT_SCALE[unit];
        return effort * unitInPixels * SCALE_FACTOR;
    };

    // Helper function to calculate the vector coordinates based on the unit and effort
    const calculateVectorCoordinates = (task: Task) => {
        const magnitude = getMagnitude(1.0, task.unit); // Example: effort is 1 for visualization
        // If it's the selected task, we want to show it vertically (up or down)
        if (task.id === selectedTask.id) {
            return { x: 0, y: -magnitude }; // Vertical direction
        }

        // Otherwise, position them based on alignment with the selected task
        const alignment = alignments.find(
            (a) =>
                (a.task1 === selectedTask.id && a.task2 === task.id) ||
                (a.task1 === task.id && a.task2 === selectedTask.id)
        );

        let angle = 90; // Default to orthogonal if no alignment
        if (alignment) {
            angle = (1 - alignment.value / 100) * 90;
        }

        // Convert angle to radians and calculate vector coordinates
        const radians = (angle * Math.PI) / 180;
        const x = Math.sin(radians) * magnitude;
        const y = -Math.cos(radians) * magnitude;

        return { x, y };
    };

    // State for hover effect
    const [hoveredTask, setHoveredTask] = useState<Task | null>(null);

    // Handle task selection on vector click
    const handleTaskSelect = (task: Task) => {
        setSelectedTask(task);
    };

    return (
        <div className="p-8 bg-gray-900 rounded-lg shadow-lg">
            <h2 className="text-2xl text-white mb-4">Task Vector Visualization</h2>
            <svg width="600" height="600" viewBox="-300 -300 600 600" className="bg-gray-800 rounded">
                {/* Draw axes */}
                <line x1="-300" y1="0" x2="300" y2="0" stroke="white" strokeWidth="1" />
                <line x1="0" y1="-300" x2="0" y2="300" stroke="white" strokeWidth="1" />

                {/* Draw vectors */}
                {tasks.map((task) => {
                    const { x, y } = calculateVectorCoordinates(task);
                    return (
                        <g key={task.id}>
                            {/* Vector line */}
                            <line
                                x1={0}
                                y1={0}
                                x2={x}
                                y2={y}
                                stroke={task.id === selectedTask.id ? 'yellow' : 'cyan'}
                                strokeWidth="3"
                                markerEnd="url(#arrowhead)"
                                onMouseEnter={() => setHoveredTask(task)}
                                onMouseLeave={() => setHoveredTask(null)}
                                onClick={() => handleTaskSelect(task)}
                            />
                            {/* Hover details */}
                            {hoveredTask?.id === task.id && (
                                <text x={x + 10} y={y - 10} fill="white" fontSize="14">
                                    {task.name} ({task.unit})
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* Arrowhead marker */}
                <defs>
                    <marker
                        id="arrowhead"
                        markerWidth="6"
                        markerHeight="6"
                        refX="5"
                        refY="2.5"
                        orient="auto"
                        markerUnits="strokeWidth"
                    >
                        <path d="M0,0 L5,2.5 L0,5 Z" fill="cyan" />
                    </marker>
                </defs>
            </svg>

            {/* Display selected task details */}
            {selectedTask && (
                <div className="mt-4 text-white">
                    <h3 className="text-lg font-semibold">Selected Task Details</h3>
                    <p><strong>Name:</strong> {selectedTask.name}</p>
                    <p><strong>Effort:</strong> {selectedTask.effort} {selectedTask.unit}</p>
                </div>
            )}
        </div>
    );
};

export default TaskVectorVisualization;
