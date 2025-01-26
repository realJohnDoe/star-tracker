import React from 'react';
import { Line } from 'react-konva';
import { Task, Alignment } from '../types';

interface AlignmentLinesProps {
    tasks: Task[];
    alignments: Alignment[];
    allAlignments:Omit<Alignment, "id">[];
    selectedTask: Task | null;
    calculateStarCoordinates: (task: Task) => { x: number; y: number };
}

const AlignmentLines: React.FC<AlignmentLinesProps> = ({ tasks, alignments, selectedTask,allAlignments, calculateStarCoordinates }) => {
    return (
        <>
        {alignments
                    .filter((alignment) => alignment.value > 0) // Only consider alignments with a positive value
                    .map((alignment) => {
                        // Find the tasks for the current alignment
                        const task1 = tasks.find((task) => task.id === alignment.task1);
                        const task2 = tasks.find((task) => task.id === alignment.task2);

                        // If both tasks are found and visible (either they are the selected task or they have a positive alignment)
                        if (task1 && task2) {
                            const isTask1Visible = tasks.some((task) => task.id === task1.id && (
                                !selectedTask || (selectedTask.id === task1.id || allAlignments.some(
                                    (a) => (a.task1 === selectedTask.id && a.task2 === task1.id) ||
                                        (a.task1 === task1.id && a.task2 === selectedTask.id)
                                ))
                            ));

                            const isTask2Visible = tasks.some((task) => task.id === task2.id && (
                                !selectedTask || (selectedTask.id === task2.id || allAlignments.some(
                                    (a) => (a.task1 === selectedTask.id && a.task2 === task2.id) ||
                                        (a.task1 === task2.id && a.task2 === selectedTask.id)
                                ))
                            ));

                            // If both tasks are visible, render the line
                            if (isTask1Visible && isTask2Visible) {
                                const { x: x1, y: y1 } = calculateStarCoordinates(task1);
                                const { x: x2, y: y2 } = calculateStarCoordinates(task2);

                                return (
                                    <Line
                                        key={`line-${task1.id}-${task2.id}`}
                                        points={[x1, y1, x2, y2]} // Points from task1 to task2
                                        stroke="rgba(255, 255, 255, 0.5)" // Semi-transparent white color
                                        strokeWidth={2} // Line width
                                        opacity={0.5} // Adjust opacity as needed
                                        lineCap="round" // Rounded line ends
                                        lineJoin="round" // Rounded joints between lines
                                        dash={[5, 5]} // Optional: add dashed effect
                                    />
                                );
                            }
                        }

                        return null;
                    })}

           </>
    );
};

export default AlignmentLines;
