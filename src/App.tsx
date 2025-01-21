import React, { useEffect, useState } from 'react';
import TaskList from './TaskList';
import TaskFormComponent from './TaskFormComponent';
import { Task, Alignment } from './types';

import TaskVectorVisualization from './TaskVectorVisualization';

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [alignments, setAlignments] = useState<Alignment[]>([]);
  const [newTask, setNewTask] = useState({ name: '', effort: 0 });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [secondTask, setSecondTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/db.json');  // Load from public folder
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
    <div className="flex w-full h-screen">
      {/* Sidebar for tasks */}
      <div className="flex-1 bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 min-h-screen text-gray-900">
        <div className="max-w-full mx-auto p-8">
          <h1 className="text-4xl text-center mb-8 font-semibold text-white">Task Tracker</h1>

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
            setSecondTask={setSecondTask}
            setAlignments={setAlignments}
          />
        </div>
      </div>

      {/* Visualization Panel */}
      <div className="flex-1 bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 min-h-screen text-gray-100">
        <TaskVectorVisualization
          tasks={tasks}
          alignments={alignments}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
        />
      </div>
    </div>
  );
};

export default App;
