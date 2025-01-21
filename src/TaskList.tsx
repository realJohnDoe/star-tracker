import React, { useState } from 'react';
import { Task, Alignment } from './types';
import TaskDetailComponent from './TaskDetailComponent';

interface TaskListProps {
    tasks: Task[];
    alignments: Alignment[];
    setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
    setSecondTask: React.Dispatch<React.SetStateAction<Task | null>>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, alignments, setSelectedTask, setSecondTask }) => {
    const [selectedTask, setSelectedTaskState] = useState<Task | null>(null);

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

            {/* Show Task Details when a task is selected */}
            {selectedTask && (
                <TaskDetailComponent
                    task={selectedTask}
                    tasks={tasks}
                    alignments={alignments}  // Pass alignments here
                    setTasks={() => { }}
                    setAlignments={() => { }}
                    deleteTask={() => { }}
                />
            )}
        </div>
    );
};

export default TaskList;
