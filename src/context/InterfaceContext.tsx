import React, { createContext, useState, useContext, ReactNode } from 'react';

interface InterfaceContextType {
  isListening: boolean;
  setIsListening: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarExpanded: boolean;
  setSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  activePanel: string;
  setActivePanel: React.Dispatch<React.SetStateAction<string>>;
}

const InterfaceContext = createContext<InterfaceContextType | undefined>(undefined);

export const useInterface = () => {
  const context = useContext(InterfaceContext);
  if (!context) {
    throw new Error('useInterface must be used within an InterfaceProvider');
  }
  return context;
};

interface InterfaceProviderProps {
  children: ReactNode;
}

export const InterfaceProvider: React.FC<InterfaceProviderProps> = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(window.innerWidth > 768);
  const [activePanel, setActivePanel] = useState('home');
  
  return (
    <InterfaceContext.Provider value={{
      isListening,
      setIsListening,
      sidebarExpanded,
      setSidebarExpanded,
      activePanel,
      setActivePanel
    }}>
      {children}
    </InterfaceContext.Provider>
  );
};