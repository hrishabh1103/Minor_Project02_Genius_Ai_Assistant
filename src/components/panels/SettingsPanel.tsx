import React from 'react';
import { Settings, Volume2, Bell, Mic, Globe, Wifi } from 'lucide-react';
import { useStore } from '../../store/useStore';

const SettingsPanel: React.FC = () => {
  const { settings, updateSettings } = useStore();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
  ] as const;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-6">
        <Settings className="text-purple-400 mr-2" size={24} />
        <h2 className="text-xl font-bold text-purple-300">Settings</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">Interface</h3>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-black/20 border border-purple-900/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-purple-400" />
                <span className="text-purple-300">Notifications</span>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => updateSettings({ notifications: e.target.checked })}
                className="w-4 h-4 accent-purple-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-black/20 border border-purple-900/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Volume2 size={18} className="text-purple-400" />
                <span className="text-purple-300">Sound Effects</span>
              </div>
              <input
                type="checkbox"
                checked={settings.sound}
                onChange={(e) => updateSettings({ sound: e.target.checked })}
                className="w-4 h-4 accent-purple-600"
              />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">Voice Assistant</h3>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-black/20 border border-purple-900/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Mic size={18} className="text-purple-400" />
                <span className="text-purple-300">Voice Commands</span>
              </div>
              <input
                type="checkbox"
                checked={settings.voice}
                onChange={(e) => updateSettings({ voice: e.target.checked })}
                className="w-4 h-4 accent-purple-600"
              />
            </label>

            <div className="flex items-center justify-between p-3 bg-black/20 border border-purple-900/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-purple-400" />
                <span className="text-purple-300">Language</span>
              </div>
              <select
                value={settings.language}
                onChange={(e) => updateSettings({ language: e.target.value as typeof settings.language })}
                className="bg-black/30 border border-purple-900/50 rounded px-3 py-1 text-purple-300"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">Smart Devices</h3>
          
          <label className="flex items-center justify-between p-3 bg-black/20 border border-purple-900/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Wifi size={18} className="text-purple-400" />
              <span className="text-purple-300">Auto-Connect</span>
            </div>
            <input
              type="checkbox"
              checked={settings.autoConnect}
              onChange={(e) => updateSettings({ autoConnect: e.target.checked })}
              className="w-4 h-4 accent-purple-600"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel