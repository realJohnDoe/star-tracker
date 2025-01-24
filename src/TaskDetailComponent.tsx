import React, { useMemo, useState } from 'react';
import { Task, Alignment } from './types';
import { Box, Typography, Select, MenuItem, Button, TextField, List, ListItem, Divider } from '@mui/material';
import { calculateIndirectAlignments } from './calculateVectorSpace';

interface TaskDetailProps {
    task: Task;
    alignments: Alignment[];
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    setAlignments: React.Dispatch<React.SetStateAction<Alignment[]>>;
    deleteTask: (id: number) => void;
}

const TaskDetailComponent: React.FC<TaskDetailProps> = ({ task, alignments, tasks, setAlignments, deleteTask }) => {
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [alignmentValue, setAlignmentValue] = useState<number>(0);

    // Filter alignments related to this task (direct alignments)
    const taskAlignments = alignments.filter(
        (alignment) => alignment.task1 === task.id || alignment.task2 === task.id
    );

    // Memoize indirect alignments calculation to optimize performance
    const indirectAlignments = useMemo(() => {
        return calculateIndirectAlignments(task.id, alignments);
    }, [task.id, alignments]);

    // Handle adding a new alignment
    const handleAddAlignment = () => {
        if (selectedTaskId === null || selectedTaskId === task.id || alignmentValue <= 0 || alignmentValue > 100) {
            alert('Please select a valid task and enter a value between 1 and 100.');
            return;
        }

        const newAlignment: Alignment = {
            id: Date.now(),
            task1: task.id,
            task2: selectedTaskId,
            value: alignmentValue,
        };

        setAlignments((prevAlignments) => [...prevAlignments, newAlignment]);

        setSelectedTaskId(null);
        setAlignmentValue(0);
    };

    return (
        <Box sx={{ bgcolor: 'grey.800', p: 4, borderRadius: 2, color: 'white', boxShadow: 3 }}>
            <Typography variant="h4" gutterBottom>
                {task.name}
            </Typography>
            <Typography>
                <strong>Effort:</strong> {task.unit}
            </Typography>

            <Typography variant="h6" sx={{ mt: 4 }}>
                Direct Alignments
            </Typography>
            {taskAlignments.length > 0 ? (
                <List>
                    {taskAlignments.map((alignment) => {
                        const otherTaskId = alignment.task1 === task.id ? alignment.task2 : alignment.task1;
                        const relatedTask = tasks.find((t) => t.id === otherTaskId);
                        return (
                            <ListItem key={alignment.id}>
                                <Typography>
                                    Aligned with <strong>{relatedTask?.name}</strong>: {alignment.value}%
                                </Typography>
                            </ListItem>
                        );
                    })}
                </List>
            ) : (
                <Typography>No direct alignments found.</Typography>
            )}

            <Typography variant="h6" sx={{ mt: 4 }}>
                Indirect Alignments
            </Typography>
            {Object.keys(indirectAlignments).length > 0 ? (
                <List>
                    {indirectAlignments.map((alignment) => {
                        const otherTaskId = alignment.task1 === task.id ? alignment.task2 : alignment.task1;
                        const relatedTask = tasks.find((t) => t.id === otherTaskId);
                        return (
                            <ListItem key={crypto.randomUUID()}>
                                <Typography>
                                    Indirectly aligned with <strong>{relatedTask?.name}</strong>: {alignment.value}%
                                </Typography>
                            </ListItem>
                        );
                    })}
                </List>
            ) : (
                <Typography>No indirect alignments found.</Typography>
            )}

            <Divider sx={{ my: 3, bgcolor: 'grey.600' }} />

            <Typography variant="h6" sx={{ mt: 4 }}>
                Add New Alignment
            </Typography>

            <Box sx={{ mt: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    Select Task:
                </Typography>
                <Select
                    fullWidth
                    value={selectedTaskId ?? ''}
                    onChange={(e) => setSelectedTaskId(Number(e.target.value))}
                    displayEmpty
                    sx={{ bgcolor: 'grey.700', color: 'white' }}
                >
                    <MenuItem value="">-- Select a Task --</MenuItem>
                    {tasks
                        .filter((t) => t.id !== task.id)
                        .map((t) => (
                            <MenuItem key={t.id} value={t.id}>
                                {t.name}
                            </MenuItem>
                        ))}
                </Select>
            </Box>

            <Box sx={{ mt: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                    Alignment Value (%):
                </Typography>
                <TextField
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={alignmentValue}
                    onChange={(e) => setAlignmentValue(Number(e.target.value))}
                    inputProps={{ min: 1, max: 100 }}
                    sx={{ bgcolor: 'grey.700', color: 'white', borderRadius: 1 }}
                />
            </Box>

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary" onClick={handleAddAlignment}>
                    Add Alignment
                </Button>

                <Button variant="contained" color="error" onClick={() => deleteTask(task.id)}>
                    Delete Task
                </Button>
            </Box>
        </Box>
    );
};

export default TaskDetailComponent;