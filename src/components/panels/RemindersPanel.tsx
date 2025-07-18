import React, { useState } from 'react';
import { Bell, Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { format, isAfter } from 'date-fns';

const RemindersPanel: React.FC = () => {
  const [newReminder, setNewReminder] = useState('');
  const [newDateTime, setNewDateTime] = useState('');
  const { reminders, addReminder, toggleReminder, removeReminder } = useStore();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReminder.trim() && newDateTime) {
      addReminder(newReminder.trim(), new Date(newDateTime));
      setNewReminder('');
      setNewDateTime('');
    }
  };

  const sortedReminders = [...reminders].sort((a, b) => 
    a.datetime.getTime() - b.datetime.getTime()
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-6">
        <Bell className="text-purple-400 mr-2" size={24} />
        <h2 className="text-xl font-bold text-purple-300">Reminders</h2>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          type="text"
          value={newReminder}
          onChange={(e) => setNewReminder(e.target.value)}
          placeholder="Reminder title..."
          className="w-full bg-black/30 border border-purple-900/50 rounded-lg px-4 py-2 text-white placeholder-purple-700 focus:outline-none focus:border-purple-500"
        />
        <div className="flex gap-2">
          <input
            type="datetime-local"
            value={newDateTime}
            onChange={(e) => setNewDateTime(e.target.value)}
            className="flex-1 bg-black/30 border border-purple-900/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="bg-purple-900/50 hover:bg-purple-800/50 text-purple-300 px-4 rounded-lg flex items-center"
          >
            <Plus size={20} />
          </button>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2">
        {sortedReminders.map((reminder) => (
          <div
            key={reminder.id}
            className="flex items-center gap-3 p-3 bg-black/20 border border-purple-900/30 rounded-lg group"
          >
            <button
              onClick={() => toggleReminder(reminder.id)}
              className="text-purple-400 hover:text-purple-300"
            >
              {reminder.completed ? (
                <CheckCircle size={20} className="text-green-500" />
              ) : (
                <Circle size={20} />
              )}
            </button>
            
            <div className="flex-1">
              <div className={reminder.completed ? 'line-through text-purple-700' : 'text-purple-300'}>
                {reminder.title}
              </div>
              <div className="text-sm text-purple-600">
                {format(reminder.datetime, 'PPp')}
              </div>
            </div>
            
            <button
              onClick={() => removeReminder(reminder.id)}
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

export default RemindersPanel