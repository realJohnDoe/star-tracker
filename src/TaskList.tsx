import React, { useState } from 'react';
import { Task, Alignment } from './types';
import TaskDetailComponent from './TaskDetailComponent';

interface TaskListProps {
    tasks: Task[];
    alignments: Alignment[];
    setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
    setSecondTask: React.Dispatch<React.SetStateAction<Task | null>>;
    setAlignments: React.Dispatch<React.SetStateAction<Alignment[]>>;
  }
  
  const TaskList: React.FC<TaskListProps> = ({ tasks, alignments, setSelectedTask, setSecondTask, setAlignments }) => {
    const [selectedTask, setSelectedTaskState] = React.useState<Task | null>(null);
  
    return (
      <div>
        <h2 className="text-2xl text-white mb-4">Task List</h2>
        <ul>
          {tasks.map((task) => (
            <li
              key={task.id}
              className="text-white bg-gray-700 p-4 rounded-lg mb-4 cursor-pointer"
              onClick={() => setSelectedTaskState(task)}
            >
              {task.name}
            </li>
          ))}
        </ul>
  
        {selectedTask && (
          <TaskDetailComponent
            task={selectedTask}
            tasks={tasks}
            alignments={alignments}
            setTasks={() => {}}
            setAlignments={setAlignments}
            deleteTask={() => {}}
          />
        )}
      </div>
    );
  };
  
  export default TaskList;
  