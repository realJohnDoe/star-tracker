import React, { useEffect, useState } from 'react';
import TaskList from './TaskList';
import TaskFormComponent from './TaskFormComponent';
import { Task, Alignment } from './types';

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [alignments, setAlignments] = useState<Alignment[]>([]);
  const [newTask, setNewTask] = useState({ name: '', effort: 0 });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [secondTask, setSecondTask] = useState<Task | null>(null);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    const storedAlignments = localStorage.getItem('alignments');

    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }

    if (storedAlignments) {
      setAlignments(JSON.parse(storedAlignments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('alignments', JSON.stringify(alignments));
  }, [tasks, alignments]);

  return (
    <div className="bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 min-h-screen text-gray-900">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl text-center mb-8 font-semibold text-white">Task Tracker</h1>

        {/* Task Form for Adding New Tasks */}
        <TaskFormComponent
          tasks={tasks}
          setTasks={setTasks}
          newTask={newTask}
          setNewTask={setNewTask}
        />

        {/* Task List */}
        <TaskList
          tasks={tasks}
          setSelectedTask={setSelectedTask}
          setSecondTask={setSecondTask}
        />
      </div>
    </div>
  );
};

export default App;
