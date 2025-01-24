import { useEffect, useState } from 'react';
import TaskFormList from './TaskFormList'
import TaskDetailComponent from './TaskDetailComponent';
import { Task, Alignment } from './types';
import { Box } from '@mui/material';
import TaskStarVisualization from './TaskStarVisualization';

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [alignments, setAlignments] = useState<Alignment[]>([]);
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
    <Box
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        bgcolor: 'background.default',
        color: 'white',
      }}
    >
      {/* TaskVectorVisualization in the background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1, // Lower z-index to stay in the background
        }}
      >
        <TaskStarVisualization
          tasks={tasks}
          alignments={alignments}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
        />
      </Box>

      {/* Left Sidebar: Task Form + Task List */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: { xs: '100%', md: '400px' },  // Full width on small screens, fixed width on larger
          height: '100vh',
          display: 'flex',
          maxWidth: { md: '400px' },
          bgcolor: 'transparent',
          p: 3,
          zIndex: 2, // Higher z-index to overlay on visualization
        }}
      >
        {/* <TaskFormComponent
          tasks={tasks}
          setTasks={setTasks}

        />

        <TaskList
          tasks={tasks}
          alignments={alignments}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          setAlignments={setAlignments}
          setSecondTask={() => { }}
        /> */}

        <TaskFormList
          tasks={tasks}
          setTasks={setTasks}
          alignments={alignments}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          setAlignments={setAlignments}
        />
      </Box>

      {/* Right Sidebar: Task Details (visible if a task is selected) */}
      {selectedTask && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: { xs: '100%', md: '400px' },
            maxWidth: { md: '400px' },
            height: '100vh',
            display: 'flex',
            bgcolor: 'transparent',
            p: 3,
            zIndex: 2, // Ensure it's above the visualization
            overflowY: 'auto',
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
        </Box>
      )}
    </Box>
  );
};

export default App;
