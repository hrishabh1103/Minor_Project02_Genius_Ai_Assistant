import React, { useState, useEffect } from 'react';
import { Cpu, MemoryStick as Memory, Thermometer, Clock, Wifi, CircleOff } from 'lucide-react';

const SystemStatusCards: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Simulate changing system metrics
  useEffect(() => {
    const updateMetrics = () => {
      setCpuUsage(Math.floor(10 + Math.random() * 30));
      setMemoryUsage(Math.floor(40 + Math.random() * 20));
      setTemperature(Math.floor(60 + Math.random() * 20));
      setIsOnline(Math.random() > 0.05); // Occasionally go offline
    };
    
    updateMetrics();
    const interval = setInterval(updateMetrics, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      <StatusCard 
        icon={<Clock size={16} />}
        title="System Time"
        value={time.toLocaleTimeString()}
        detail={time.toLocaleDateString()}
        color="cyan"
      />
      
      <StatusCard 
        icon={<Cpu size={16} />}
        title="CPU Usage"
        value={`${cpuUsage}%`}
        detail={cpuUsage > 25 ? "High" : "Normal"}
        color={cpuUsage > 25 ? "amber" : "green"}
      />
      
      <StatusCard 
        icon={<Memory size={16} />}
        title="Memory"
        value={`${memoryUsage}%`}
        detail={`${(16 * memoryUsage / 100).toFixed(1)}GB / 16GB`}
        color={memoryUsage > 50 ? "amber" : "green"}
      />
      
      <StatusCard 
        icon={<Thermometer size={16} />}
        title="Temperature"
        value={`${temperature}°F`}
        detail={temperature > 70 ? "Caution" : "Normal"}
        color={temperature > 70 ? "amber" : "green"}
      />
      
      <StatusCard 
        icon={isOnline ? <Wifi size={16} /> : <CircleOff size={16} />}
        title="Network"
        value={isOnline ? "Online" : "Offline"}
        detail={isOnline ? "Connected" : "No Connection"}
        color={isOnline ? "green" : "red"}
      />
    </div>
  );
};

interface StatusCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  detail: string;
  color: 'cyan' | 'green' | 'amber' | 'red';
}

const StatusCard: React.FC<StatusCardProps> = ({ icon, title, value, detail, color }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'cyan':
        return 'from-cyan-900/40 to-blue-900/40 border-cyan-800 text-cyan-400';
      case 'green':
        return 'from-emerald-900/40 to-green-900/40 border-emerald-800 text-emerald-400';
      case 'amber':
        return 'from-amber-900/40 to-orange-900/40 border-amber-800 text-amber-400';
      case 'red':
        return 'from-red-900/40 to-rose-900/40 border-red-800 text-red-400';
      default:
        return 'from-cyan-900/40 to-blue-900/40 border-cyan-800 text-cyan-400';
    }
  };

  return (
    <div className={`p-3 rounded-lg bg-gradient-to-br ${getColorClasses()} backdrop-blur-md border border-opacity-50 shadow-lg`}>
      <div className="flex items-center mb-1">
        <div className="mr-2">{icon}</div>
        <div className="text-xs font-semibold opacity-80">{title}</div>
      </div>
      <div className="font-mono text-lg font-bold">{value}</div>
      <div className="text-xs opacity-70">{detail}</div>
    </div>
  );
};

export default SystemStatusCards;