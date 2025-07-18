import React from 'react';
import StarfieldBackground from './components/StarfieldBackground';
import MainInterface from './components/MainInterface';
import { InterfaceProvider } from './context/InterfaceContext';

function App() {
  return (
    <InterfaceProvider>
      <div className="relative w-full h-screen overflow-hidden bg-black text-white font-['Space_Grotesk']">
        <StarfieldBackground />
        <MainInterface />
      </div>
    </InterfaceProvider>
  );
}

export default App;