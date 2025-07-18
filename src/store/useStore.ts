import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addDays, isAfter } from 'date-fns';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

interface Reminder {
  id: string;
  title: string;
  datetime: Date;
  completed: boolean;
}

interface SmartDevice {
  id: string;
  name: string;
  type: 'tv' | 'fan' | 'bulb' | 'socket';
  isConnected: boolean;
  isPowered: boolean;
  settings: {
    brightness?: number;
    temperature?: number;
    speed?: number;
    volume?: number;
    channel?: number;
  };
}

interface Settings {
  theme: 'dark' | 'darker';
  notifications: boolean;
  sound: boolean;
  voice: boolean;
  language: 'en' | 'es' | 'fr';
  autoConnect: boolean;
}

interface AssistantMessage {
  id: string;
  text: string;
  type: 'user' | 'assistant';
  timestamp: Date;
}

interface Store {
  tasks: Task[];
  reminders: Reminder[];
  smartDevices: SmartDevice[];
  settings: Settings;
  messages: AssistantMessage[];
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  addReminder: (title: string, datetime: Date) => void;
  toggleReminder: (id: string) => void;
  removeReminder: (id: string) => void;
  addSmartDevice: (device: Omit<SmartDevice, 'id' | 'isConnected' | 'isPowered'>) => void;
  toggleDeviceConnection: (id: string) => void;
  toggleDevicePower: (id: string) => void;
  updateDeviceSettings: (id: string, settings: Partial<SmartDevice['settings']>) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  addMessage: (text: string, type: 'user' | 'assistant') => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      tasks: [],
      reminders: [],
      messages: [],
      smartDevices: [
        {
          id: '1',
          name: 'Living Room TV',
          type: 'tv',
          isConnected: false,
          isPowered: false,
          settings: { volume: 50, channel: 1 },
        },
        {
          id: '2',
          name: 'Bedroom Light',
          type: 'bulb',
          isConnected: false,
          isPowered: false,
          settings: { brightness: 100 },
        },
      ],
      settings: {
        theme: 'dark',
        notifications: true,
        sound: true,
        voice: true,
        language: 'en',
        autoConnect: false,
      },
      addTask: (title) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            { id: crypto.randomUUID(), title, completed: false, createdAt: new Date() },
          ],
        })),
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      addReminder: (title, datetime) =>
        set((state) => ({
          reminders: [
            ...state.reminders,
            { id: crypto.randomUUID(), title, datetime, completed: false },
          ],
        })),
      toggleReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
          ),
        })),
      removeReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.filter((reminder) => reminder.id !== id),
        })),
      addSmartDevice: (device) =>
        set((state) => ({
          smartDevices: [
            ...state.smartDevices,
            {
              ...device,
              id: crypto.randomUUID(),
              isConnected: false,
              isPowered: false,
            },
          ],
        })),
      toggleDeviceConnection: (id) =>
        set((state) => ({
          smartDevices: state.smartDevices.map((device) =>
            device.id === id
              ? { ...device, isConnected: !device.isConnected, isPowered: false }
              : device
          ),
        })),
      toggleDevicePower: (id) =>
        set((state) => ({
          smartDevices: state.smartDevices.map((device) =>
            device.id === id && device.isConnected
              ? { ...device, isPowered: !device.isPowered }
              : device
          ),
        })),
      updateDeviceSettings: (id, settings) =>
        set((state) => ({
          smartDevices: state.smartDevices.map((device) =>
            device.id === id
              ? { ...device, settings: { ...device.settings, ...settings } }
              : device
          ),
        })),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      addMessage: (text, type) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: crypto.randomUUID(),
              text,
              type,
              timestamp: new Date(),
            },
          ],
        })),
    }),
    {
      name: 'genius-storage',
    }
  )
);