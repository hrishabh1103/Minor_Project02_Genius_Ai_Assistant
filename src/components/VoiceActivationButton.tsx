import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useInterface } from '../context/InterfaceContext';

const VoiceActivationButton: React.FC = () => {
  const { isListening, setIsListening } = useInterface();
  
  return (
    <button
      onClick={() => setIsListening(!isListening)}
      className={`relative group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
        isListening 
          ? 'bg-purple-600 shadow-lg shadow-purple-600/30' 
          : 'bg-cyan-900 hover:bg-cyan-800'
      }`}
    >
      {/* Pulse animation when listening */}
      {isListening && (
        <div className="absolute inset-0 rounded-full animate-ping-slow opacity-30 bg-purple-500" />
      )}
      
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
        isListening ? 'opacity-70' : 'opacity-0 group-hover:opacity-30'
      }`} style={{ 
        background: 'radial-gradient(circle, rgba(0,255,255,0.3) 0%, rgba(138,43,226,0) 70%)',
      }} />
      
      {/* Icon */}
      <div className="relative z-10">
        {isListening ? (
          <Mic className="text-white" size={20} />
        ) : (
          <MicOff className="text-cyan-300" size={20} />
        )}
      </div>
    </button>
  );
};

export default VoiceActivationButton;