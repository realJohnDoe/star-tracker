import React, { useEffect, useState } from 'react';
import TaskList from './TaskList';
import TaskFormComponent from './TaskFormComponent';
import TaskDetailComponent from './TaskDetailComponent';
import TaskVectorVisualization from './TaskVectorVisualization';
import { Task, Alignment } from './types';
import { Box, Grid, Typography, Paper } from '@mui/material';

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [alignments, setAlignments] = useState<Alignment[]>([]);
  const [newTask, setNewTask] = useState({ name: '', unit: 'Hours' });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/db.json'); // Load from public folder
        if (!response.ok) {
          throw new Error('Failed to load data');
        }
        const data = await response.json();
        setTasks(data.tasks);
        setAlignments(data.alignments);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ height: '100vh', bgcolor: 'background.default', color: 'white' }}>

      <Grid container sx={{ height: '100vh', overflow: 'hidden' }}>
        {/* Left Sidebar: Task Form + Task List */}
        <Grid
          item
          xs={12}
          md="auto"
          sx={{
            minWidth: { md: '300px' },  // Fixed width on larger screens
            maxWidth: { md: '400px' },  // Limit width
            overflowY: 'auto',          // Enable scrolling for content
            height: '100vh',             // Full viewport height
            bgcolor: 'secondary.dark',
            p: 3,
          }}
        >
          <TaskFormComponent
            tasks={tasks}
            setTasks={setTasks}
            newTask={newTask}
            setNewTask={setNewTask}
          />

          <TaskList
            tasks={tasks}
            alignments={alignments}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
            setAlignments={setAlignments}
            setSecondTask={() => { }}
          />
        </Grid>

        <Grid
          item
          xs
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'secondary.main',
            p: 3,
            flexGrow: 1,      // Ensure it takes up all available space
            minWidth: 0,       // Prevent flexbox shrinking issues
            flexBasis: 0,      // Ensure it distributes space correctly
          }}
        >
          <TaskVectorVisualization
            tasks={tasks}
            alignments={alignments}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
          />
        </Grid>

        {/* Right Sidebar: Task Details (only visible if a task is selected) */}
        {selectedTask && (
          <Grid
            item
            xs={12}
            md="auto"
            sx={{
              minWidth: { md: '300px' },
              maxWidth: { md: '400px' },
              overflowY: 'auto',
              height: '100vh',
              bgcolor: 'secondary.dark',
              p: 3,
            }}
          >
            <TaskDetailComponent
              task={selectedTask}
              tasks={tasks}
              alignments={alignments}
              setTasks={() => { }}
              setAlignments={setAlignments}
              deleteTask={() => { }}
            />
          </Grid>
        )}
      </Grid>


    </Box>
  );
};

export default App;
