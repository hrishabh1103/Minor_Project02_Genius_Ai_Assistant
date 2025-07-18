import React, { useState } from 'react';
import { Lightbulb, Fan, Tv, Power, Plus, Wifi, WifiOff, Trash2, Search, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

const deviceTypes = [
  { type: 'tv' as const, icon: Tv, label: 'TV' },
  { type: 'fan' as const, icon: Fan, label: 'Fan' },
  { type: 'bulb' as const, icon: Lightbulb, label: 'Light' },
  { type: 'socket' as const, icon: Power, label: 'Socket' },
];

const SmartDevicesPanel: React.FC = () => {
  const [newDeviceName, setNewDeviceName] = useState('');
  const [selectedType, setSelectedType] = useState<'tv' | 'fan' | 'bulb' | 'socket'>('bulb');
  const [isSearching, setIsSearching] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);
  const { smartDevices, addSmartDevice, toggleDeviceConnection, toggleDevicePower, updateDeviceSettings } = useStore();

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDeviceName.trim()) {
      addSmartDevice({
        name: newDeviceName.trim(),
        type: selectedType,
        settings: {},
      });
      setNewDeviceName('');
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    setSearchComplete(false);
    
    // Simulate device search for 5 seconds
    setTimeout(() => {
      setIsSearching(false);
      setSearchComplete(true);
      
      // Reset search complete status after 3 seconds
      setTimeout(() => {
        setSearchComplete(false);
      }, 3000);
    }, 5000);
  };

  const getDeviceControls = (device: typeof smartDevices[0]) => {
    if (!device.isConnected) return null;

    switch (device.type) {
      case 'bulb':
        return (
          <input
            type="range"
            min="0"
            max="100"
            value={device.settings.brightness ?? 100}
            onChange={(e) => updateDeviceSettings(device.id, { brightness: Number(e.target.value) })}
            className="w-full accent-cyan-400"
            disabled={!device.isPowered}
          />
        );
      case 'fan':
        return (
          <input
            type="range"
            min="0"
            max="5"
            value={device.settings.speed ?? 0}
            onChange={(e) => updateDeviceSettings(device.id, { speed: Number(e.target.value) })}
            className="w-full accent-cyan-400"
            disabled={!device.isPowered}
          />
        );
      case 'tv':
        return (
          <div className="flex gap-4">
            <input
              type="range"
              min="0"
              max="100"
              value={device.settings.volume ?? 50}
              onChange={(e) => updateDeviceSettings(device.id, { volume: Number(e.target.value) })}
              className="w-full accent-cyan-400"
              disabled={!device.isPowered}
            />
            <input
              type="number"
              min="1"
              max="999"
              value={device.settings.channel ?? 1}
              onChange={(e) => updateDeviceSettings(device.id, { channel: Number(e.target.value) })}
              className="w-20 bg-black/30 border border-cyan-900/50 rounded px-2 text-center"
              disabled={!device.isPowered}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Lightbulb className="text-cyan-400 mr-2" size={24} />
          <h2 className="text-xl font-bold text-cyan-300">Smart Devices</h2>
        </div>
        
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSearching ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Searching for devices...</span>
            </>
          ) : (
            <>
              <Search size={18} />
              <span>Search Nearby</span>
            </>
          )}
        </button>
      </div>

      {searchComplete && (
        <div className="mb-6 p-4 bg-cyan-900/20 border border-cyan-900/30 rounded-lg text-cyan-400 animate-fade-in">
        <div className="text-center font-semibold mb-2">Devices Found Nearby:</div>
       <ul className="text-left list-disc list-inside space-y-1">
          <li>Samsung S20 Fe</li>
          <li>Cult Fit Watch 6</li>
          <li>OnePlus Buds Pro 2</li>
          <li>Realme Narzo 60</li>
          <li>Motorola E30</li>
          <li>Samsung M54</li>
          <li>Redmi Note 10</li>
          <li>Danger</li>
          <li>Apple iPhone 13</li>
          <li>Google Pixel 8</li>
       </ul>
      </div>
    )}

      <form onSubmit={handleAddDevice} className="mb-6">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newDeviceName}
            onChange={(e) => setNewDeviceName(e.target.value)}
            placeholder="Device name..."
            className="flex-1 bg-black/30 border border-cyan-900/50 rounded-lg px-4 py-2 text-white placeholder-cyan-700 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-300 px-4 rounded-lg flex items-center"
          >
            <Plus size={20} />
          </button>
        </div>
        
        <div className="flex gap-2">
          {deviceTypes.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`flex-1 p-2 rounded-lg flex flex-col items-center gap-1 ${
                selectedType === type
                  ? 'bg-cyan-900/50 text-cyan-300'
                  : 'bg-black/30 text-cyan-700 hover:bg-cyan-900/30 hover:text-cyan-500'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </form>

      <div className="flex-1 overflow-y-auto space-y-3">
        {smartDevices.map((device) => (
          <div
            key={device.id}
            className="p-4 bg-black/20 border border-cyan-900/30 rounded-lg space-y-3"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleDeviceConnection(device.id)}
                className={`${
                  device.isConnected ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {device.isConnected ? <Wifi size={20} /> : <WifiOff size={20} />}
              </button>
              
              <span className="flex-1 text-cyan-300">{device.name}</span>
              
              <button
                onClick={() => toggleDevicePower(device.id)}
                disabled={!device.isConnected}
                className={`${
                  device.isPowered
                    ? 'text-green-500'
                    : 'text-gray-600'
                } disabled:opacity-50`}
              >
                <Power size={20} />
              </button>
            </div>

            {device.isConnected && (
              <div className="pt-2 border-t border-cyan-900/30">
                {getDeviceControls(device)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartDevicesPanel;