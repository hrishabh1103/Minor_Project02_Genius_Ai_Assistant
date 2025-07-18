import React from 'react';
import { 
  Home, 
  ListChecks, 
  Bell, 
  Lightbulb,
  MessageSquare,
  Trophy,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useInterface } from '../context/InterfaceContext';
import VoiceActivationButton from './VoiceActivationButton';

const NavigationSidebar: React.FC = () => {
  const { sidebarExpanded, setSidebarExpanded, activePanel, setActivePanel } = useInterface();
  
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'tasks', icon: ListChecks, label: 'Tasks' },
    { id: 'reminders', icon: Bell, label: 'Reminders' },
    { id: 'devices', icon: Lightbulb, label: 'Smart Devices' },
    { id: 'console', icon: MessageSquare, label: 'Command Console' },
    { id: 'ipl', icon: Trophy, label: 'IPL Predictor' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ] as const;
  
  return (
    <div 
      className={`flex flex-col h-full bg-gray-950/70 backdrop-blur-lg border-r border-cyan-900/50 transition-all duration-300 ${
        sidebarExpanded ? 'w-56' : 'w-16'
      }`}
    >
      <div className="p-4 border-b border-cyan-900/50 flex items-center justify-center">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-purple-600/20">
          <span className="text-white font-bold text-sm">G</span>
        </div>
        {sidebarExpanded && (
          <span className="ml-3 font-bold text-cyan-400 tracking-wider">GENIUS</span>
        )}
      </div>
      
      <div className="flex-1 py-6">
        {navItems.map((item) => (
          <NavItem 
            key={item.id}
            id={item.id}
            Icon={item.icon}
            label={item.label}
            active={activePanel === item.id}
            expanded={sidebarExpanded}
            onClick={() => setActivePanel(item.id)}
          />
        ))}
      </div>
      
      <div className="hidden md:block mb-4 px-3">
        <VoiceActivationButton />
      </div>
      
      <div className="p-3 border-t border-cyan-900/50 flex justify-center">
        <button 
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className="p-2 rounded-full bg-cyan-900/30 hover:bg-cyan-900/50 text-cyan-400 transition-colors"
        >
          {sidebarExpanded 
            ? <ChevronLeft size={18} /> 
            : <ChevronRight size={18} />
          }
        </button>
      </div>
    </div>
  );
};

interface NavItemProps {
  id: string;
  Icon: React.FC<{ size?: number }>;
  label: string;
  active: boolean;
  expanded: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ id, Icon, label, active, expanded, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center p-3 my-1 mx-2 rounded-lg cursor-pointer transition-all duration-200 group ${
        active 
          ? 'bg-gradient-to-r from-blue-900/60 to-purple-900/60 text-cyan-300' 
          : 'hover:bg-cyan-900/20 text-gray-400 hover:text-cyan-400'
      }`}
    >
      <div className={`${active ? 'animate-pulse-slow' : ''}`}>
        <Icon size={20} />
      </div>
      
      {expanded && (
        <span className="ml-3 font-medium truncate">{label}</span>
      )}
      
      {active && (
        <div className="absolute left-0 w-1 h-8 bg-cyan-400 rounded-r-full shadow-lg shadow-cyan-400/50" />
      )}
    </div>
  );
};

export default NavigationSidebar;