import React, { useState } from 'react';
import { Task, Alignment } from './types';

interface TaskVectorVisualizationProps {
    tasks: Task[];
    alignments: Alignment[];
    selectedTask: Task | null;
    setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
}

const TaskVectorVisualization: React.FC<TaskVectorVisualizationProps> = ({ tasks, alignments, selectedTask, setSelectedTask }) => {
    const [hoveredTask, setHoveredTask] = useState<Task | null>(null); // For mouseover

    if (!selectedTask) return <div className="text-white">Select a task to visualize.</div>;

    const SCALE_FACTOR = 10;  // Increase this value to lengthen arrows

    const calculateVectorCoordinates = (task: Task) => {
        if (task.id === selectedTask.id) {
            return { x: 0, y: -task.effort * SCALE_FACTOR };
        }

        const alignment = alignments.find(a =>
            (a.task1 === selectedTask.id && a.task2 === task.id) ||
            (a.task1 === task.id && a.task2 === selectedTask.id)
        );

        let angle = 90;  // Default to orthogonal if no alignment
        if (alignment) {
            angle = (1 - alignment.value / 100) * 90;
        }

        const radians = (angle * Math.PI) / 180;
        const x = Math.sin(radians) * task.effort * SCALE_FACTOR;
        const y = -Math.cos(radians) * task.effort * SCALE_FACTOR;

        return { x, y };
    };

    const handleMouseOver = (task: Task) => {
        setHoveredTask(task); // Set the hovered task to show info
    };

    const handleMouseOut = () => {
        setHoveredTask(null); // Reset the hovered task when the mouse leaves
    };

    const handleClick = (task: Task) => {
        setSelectedTask(task); // Set the clicked task as the selected task
    };

    return (
        <div className="p-8 bg-gray-900 rounded-lg shadow-lg">
            <h2 className="text-2xl text-white mb-4">Task Vector Visualization</h2>
            <svg width="400" height="400" viewBox="-200 -200 400 400" className="bg-gray-800 rounded">
                {/* Draw axes */}
                <line x1="-200" y1="0" x2="200" y2="0" stroke="white" strokeWidth="1" />
                <line x1="0" y1="-200" x2="0" y2="200" stroke="white" strokeWidth="1" />

                {/* Draw vectors */}
                {tasks.map((task) => {
                    const { x, y } = calculateVectorCoordinates(task);
                    const alignment = alignments.find(a =>
                        (a.task1 === selectedTask.id && a.task2 === task.id) ||
                        (a.task1 === task.id && a.task2 === selectedTask.id)
                    );

                    return (
                        <line
                            key={task.id}
                            x1={0}
                            y1={0}
                            x2={x}
                            y2={y}
                            stroke={task.id === selectedTask.id ? 'yellow' : 'cyan'}
                            strokeWidth="3"
                            markerEnd="url(#arrowhead)"
                            onMouseOver={() => handleMouseOver(task)}  // Show task name and alignment on hover
                            onMouseOut={handleMouseOut}  // Reset task name when mouse leaves
                            onClick={() => handleClick(task)}  // Set task as selected on click
                        />
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

            {/* Show task and alignment info when a task is hovered */}
            {hoveredTask && (
                <div className="text-white mt-4">
                    <p><strong>Task: </strong>{hoveredTask.name}</p>
                    {selectedTask && (
                        <p>
                            <strong>Alignment with "{selectedTask.name}": </strong>
                            {
                                // Find alignment value
                                alignments.find(a =>
                                    (a.task1 === selectedTask.id && a.task2 === hoveredTask.id) ||
                                    (a.task1 === hoveredTask.id && a.task2 === selectedTask.id)
                                )?.value || 'No alignment'
                            }%
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskVectorVisualization;
