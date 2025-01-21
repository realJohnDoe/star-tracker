import React from 'react';
import { Task, Alignment } from './types';
import TaskDetailComponent from './TaskDetailComponent';
import { List, ListItem, ListItemText, Typography, Box, Paper } from '@mui/material';

interface TaskListProps {
  tasks: Task[];
  alignments: Alignment[];
  selectedTask: Task | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setSecondTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setAlignments: React.Dispatch<React.SetStateAction<Alignment[]>>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, alignments, selectedTask, setSelectedTask, setAlignments }) => {
  return (
    <Box sx={{ p: 3 }}>
      <List>
        {tasks.map((task) => (
          <ListItem
            key={task.id}
            component={Paper}
            sx={{
              bgcolor: 'grey.800',
              color: 'white',
              mb: 2,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'grey.700' },
              borderRadius: 2,
            }}
            onClick={() => setSelectedTask(task)}
          >
            <ListItemText primary={task.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TaskList;
