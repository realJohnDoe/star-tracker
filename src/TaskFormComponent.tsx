import React, { useState } from 'react';
import { Task } from './types';
import { Box, TextField, MenuItem, Button, Typography } from '@mui/material';

interface TaskFormComponentProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskFormComponent: React.FC<TaskFormComponentProps> = ({ tasks, setTasks }) => {
  
    const [newTask, setNewTask] = useState<Task>({ id:0,name: '', unit: 'Hours' });

    
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

    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                bgcolor: 'grey.800',
                p: 4,
                borderRadius: 2,
                boxShadow: 3,
                maxWidth: 400,
                mx: 'auto',
            }}
        >
            <Typography variant="h5" gutterBottom color="white">
                Add New Task
            </Typography>

            <TextField
                fullWidth
                id="name"
                name="name"
                label="Task Name"
                variant="outlined"
                value={newTask.name}
                onChange={handleInputChange}
                required
                sx={{ bgcolor: 'grey.700', borderRadius: 1, color: 'white', mb: 3 }}
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{ style: { color: 'white' } }}
            />

            <TextField
                fullWidth
                select
                id="unit"
                name="unit"
                label="Unit of Effort"
                value={newTask.unit}
                onChange={handleInputChange}
                variant="outlined"
                required
                sx={{ bgcolor: 'grey.700', borderRadius: 1, color: 'white', mb: 3 }}
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{ style: { color: 'white' } }}
            >
                <MenuItem value="Hours">Hours</MenuItem>
                <MenuItem value="Days">Days</MenuItem>
                <MenuItem value="Weeks">Weeks</MenuItem>
                <MenuItem value="Months">Months</MenuItem>
                <MenuItem value="Years">Years</MenuItem>
            </TextField>

            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
            >
                Add Task
            </Button>
        </Box>
    );
};

export default TaskFormComponent;
