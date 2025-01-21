import React from 'react';
import { Task } from './types';
import TaskDetailComponent from './TaskDetailComponent';

interface TaskListProps {
    tasks: Task[];
    setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
    setSecondTask: React.Dispatch<React.SetStateAction<Task | null>>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, setSelectedTask, setSecondTask }) => {
    const [selectedTask, setSelectedTaskState] = React.useState<Task | null>(null);

    const deleteTask = async (id: number) => {
        try {
            await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' });
            const updatedTasks = tasks.filter(task => task.id !== id);
            setSelectedTaskState(null);
            setSelectedTask(updatedTasks);
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

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
                    alignments={[]}  // Placeholder for now
                    setTasks={() => { }}
                    setAlignments={() => { }}
                    deleteTask={deleteTask}
                />
            )}
        </div>
    );
};

export default TaskList;
