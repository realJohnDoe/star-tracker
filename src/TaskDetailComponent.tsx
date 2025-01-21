import React from 'react';
import { Task, Alignment } from './types';

interface TaskDetailProps {
  task: Task;
  alignments: Alignment[];
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setAlignments: React.Dispatch<React.SetStateAction<Alignment[]>>;
  deleteTask: (id: number) => void;
}

const TaskDetailComponent: React.FC<TaskDetailProps> = ({ task, alignments, tasks, deleteTask }) => {
  // Filter alignments specific to this task
  const taskAlignments = alignments.filter(
    (alignment) => alignment.task1 === task.id || alignment.task2 === task.id
  );

  return (
    <div className="bg-gray-800 p-6 rounded-lg text-white">
      <h2 className="text-2xl mb-4">Task Details</h2>
      <p><strong>Name:</strong> {task.name}</p>
      <p><strong>Effort:</strong> {task.effort}</p>

      <h3 className="mt-4 text-lg">Alignments</h3>
      {taskAlignments.length > 0 ? (
        <ul>
          {taskAlignments.map((alignment) => {
            const otherTaskId = alignment.task1 === task.id ? alignment.task2 : alignment.task1;
            const relatedTask = tasks.find(t => t.id === otherTaskId);
            return (
              <li key={alignment.id} className="mt-2">
                Aligned with <strong>{relatedTask?.name}</strong>: {alignment.value}%
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No alignments found.</p>
      )}

      <button 
        className="bg-red-500 px-4 py-2 mt-4 rounded"
        onClick={() => deleteTask(task.id)}
      >
        Delete Task
      </button>
    </div>
  );
};

export default TaskDetailComponent;
