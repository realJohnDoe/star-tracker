import React, { useState } from 'react';
import { Task, Alignment, taskUnitValues } from './types';
import { Box, TextField, MenuItem, Button, Typography, Divider } from '@mui/material';

interface TaskFormListProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    alignments: Alignment[];
    selectedTask: Task | null;
    setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
    setAlignments: React.Dispatch<React.SetStateAction<Alignment[]>>;
}

const TaskFormList: React.FC<TaskFormListProps> = ({ tasks, setTasks, alignments, selectedTask, setSelectedTask }) => {
    const [newTask, setNewTask] = useState<Task>({ id: 0, name: '', unit: 'Hours' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        setNewTask({ id: 0, name: '', unit: 'Hours' }); // Reset form
    };

    return (
        <Box
            sx={{
                bgcolor: 'grey.800',
                p: 0,
                borderRadius: 2,
                boxShadow: 3,
                maxWidth: 400,
                mx: 0,
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto', // Enable scroll for the whole component
            }}
        >
            {/* Sticky form section */}
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 2,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add a shadow under the form
                    bgcolor: 'grey.800',
                    p: 4,
                    borderBottom: '1px solid grey.600', // Add a bottom border to separate it from the task list
                }}
            >
                <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Experience"
                    variant="outlined"
                    value={newTask.name}
                    onChange={handleInputChange}
                    required
                    sx={{
                        bgcolor: 'grey.700',
                        borderRadius: 1,
                        color: 'white',
                        mb: 3,
                        '& .MuiInputLabel-root': {
                            color: 'white',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'grey.600',
                            },
                            '&:hover fieldset': {
                                borderColor: 'primary.main',
                            },
                        },
                    }}
                />
                <TextField
                    fullWidth
                    select
                    id="unit"
                    name="unit"
                    label="Duration"
                    value={newTask.unit}
                    onChange={handleInputChange}
                    variant="outlined"
                    required
                    sx={{
                        bgcolor: 'grey.700',
                        borderRadius: 1,
                        color: 'white',
                        mb: 3,
                        '& .MuiInputLabel-root': {
                            color: 'white',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'grey.600',
                            },
                            '&:hover fieldset': {
                                borderColor: 'primary.main',
                            },
                        },
                    }}
                >
                    {taskUnitValues.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                            {unit}
                        </MenuItem>
                    ))}
                </TextField>
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Add Task
                </Button>
            </Box>

            {/* Task list container */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {tasks.map((task, index) => (
                    <React.Fragment key={task.id}>
                        {/* Task item */}
                        <Box
                            onClick={() => setSelectedTask(task)}
                            sx={{
                                bgcolor: selectedTask?.id === task.id ? 'grey.700' : 'grey.800', // Darker on selection
                                py: 2,
                                px: 4,
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease',
                                '&:hover': {
                                    bgcolor: 'grey.700', // Darker on hover
                                },
                            }}
                        >
                            <Typography variant="h6" color="white">
                                {task.name}
                            </Typography>
                            <Typography variant="body2" color="white">
                                {task.unit}
                            </Typography>
                        </Box>

                        {/* Conditionally render divider to avoid one after the last task */}
                        {index < tasks.length - 1 && (
                            <Divider sx={{ bgcolor: 'grey.600', my: 0 }} />
                        )}
                    </React.Fragment>
                ))}
            </Box>
        </Box>
    );
};

export default TaskFormList;
