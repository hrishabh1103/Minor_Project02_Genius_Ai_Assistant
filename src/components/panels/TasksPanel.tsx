import React, { useState } from 'react';
import { ListChecks, Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { useStore } from '../../store/useStore';

const TasksPanel: React.FC = () => {
  const [newTask, setNewTask] = useState('');
  const { tasks, addTask, toggleTask, removeTask } = useStore();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      addTask(newTask.trim());
      setNewTask('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-6">
        <ListChecks className="text-cyan-400 mr-2" size={24} />
        <h2 className="text-xl font-bold text-cyan-300">Tasks</h2>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 bg-black/30 border border-cyan-900/50 rounded-lg px-4 py-2 text-white placeholder-cyan-700 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-300 px-4 rounded-lg flex items-center"
          >
            <Plus size={20} />
          </button>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 p-3 bg-black/20 border border-cyan-900/30 rounded-lg group"
          >
            <button
              onClick={() => toggleTask(task.id)}
              className="text-cyan-400 hover:text-cyan-300"
            >
              {task.completed ? (
                <CheckCircle size={20} className="text-green-500" />
              ) : (
                <Circle size={20} />
              )}
            </button>
            
            <span className={`flex-1 ${task.completed ? 'line-through text-cyan-700' : 'text-cyan-300'}`}>
              {task.title}
            </span>
            
            <button
              onClick={() => removeTask(task.id)}
              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksPanel