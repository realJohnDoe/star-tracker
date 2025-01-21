import React, { useState } from 'react';
import { Task, Alignment } from './types';
import { Box, Typography, Select, MenuItem, Button, SvgIcon, Tooltip } from '@mui/material';

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
    if (!selectedTask) return <Typography color="white">Select a task to visualize.</Typography>;

    // Constants for scaling vectors based on units
    const BASE_UNIT_IN_PIXELS = 30;
    const UNIT_SCALE = { Hours: 1, Days: 2, Weeks: 3, Months: 4, Years: 5 };
    const SCALE_FACTOR = 1;

    const getMagnitude = (effort: number, unit: keyof typeof UNIT_SCALE) => {
        return effort * BASE_UNIT_IN_PIXELS * UNIT_SCALE[unit] * SCALE_FACTOR;
    };

    const calculateVectorCoordinates = (task: Task) => {
        const magnitude = getMagnitude(1.0, task.unit);

        if (task.id === selectedTask.id) {
            return { x: 0, y: -magnitude };
        }

        const alignment = alignments.find(
            (a) =>
                (a.task1 === selectedTask.id && a.task2 === task.id) ||
                (a.task1 === task.id && a.task2 === selectedTask.id)
        );

        let angle = 90;
        if (alignment) {
            angle = (1 - alignment.value / 100) * 90;
        }

        const radians = (angle * Math.PI) / 180;
        const x = Math.sin(radians) * magnitude;
        const y = -Math.cos(radians) * magnitude;

        return { x, y };
    };

    const [hoveredTask, setHoveredTask] = useState<Task | null>(null);

    const handleTaskSelect = (task: Task) => {
        setSelectedTask(task);
    };

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                bgcolor: 'grey.900',
                borderRadius: 2,
                boxShadow: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Box sx={{ bgcolor: 'grey.800', borderRadius: 2, p: 2, overflow: 'hidden' }}>
                <svg
                    width="100%"
                    height="100%"
                    viewBox="-300 -300 600 600"
                    preserveAspectRatio="xMidYMid meet"
                    style={{ background: 'black', maxWidth: '100%', maxHeight: '100%' }}
                >
                    <line x1="-300" y1="0" x2="300" y2="0" stroke="white" strokeWidth="1" />
                    <line x1="0" y1="-300" x2="0" y2="300" stroke="white" strokeWidth="1" />

                    {tasks.map((task) => {
                        const { x, y } = calculateVectorCoordinates(task);
                        return (
                            <Tooltip key={task.id} title={`${task.name} (${task.unit})`} arrow>
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
                                    style={{ cursor: 'pointer' }}
                                />
                            </Tooltip>
                        );
                    })}

                    <defs>
                        <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="2.5" orient="auto">
                            <path d="M0,0 L5,2.5 L0,5 Z" fill="cyan" />
                        </marker>
                    </defs>
                </svg>
            </Box>

            {selectedTask && (
                <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.800', borderRadius: 1 }}>
                    <Typography variant="h6" color="primary">
                        Selected Task Details
                    </Typography>
                    <Typography color="white"><strong>Name:</strong> {selectedTask.name}</Typography>
                    <Typography color="white"><strong>Effort:</strong> {selectedTask.unit}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default TaskVectorVisualization;
