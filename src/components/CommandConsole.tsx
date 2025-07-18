import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Search, Send, WifiOff, Loader2 } from 'lucide-react';
import { useInterface } from '../context/InterfaceContext';
import { useStore } from '../store/useStore';

const API_URL = 'http://localhost:5001';

const CommandConsole: React.FC = () => {
  const { isListening, setIsListening } = useInterface();
  const { messages, addMessage } = useStore();
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const consoleRef = useRef<HTMLDivElement>(null);
  const currentMessage = messages[messages.length - 1];

  // Check server connection periodically
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch(`${API_URL}/api/health`);
        const data = await response.json();
        if (data.status === 'ok') {
          setIsConnected(true);
          setConnectionError(null);
        }
      } catch (error) {
        setIsConnected(false);
        setConnectionError('Unable to connect to server. Please ensure the Python server is running (python3 server.py)');
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentMessage?.type === 'assistant') {
      const text = currentMessage.text;
      let index = 0;

      setDisplayText('');
      setCurrentIndex(0);

      const typingInterval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(prev => prev + text.charAt(index));
          setCurrentIndex(index);
          index++;
        } else {
          clearInterval(typingInterval);
        }
      }, 30);

      // Speak after typing
      const timeout = setTimeout(() => {
        speakText(text);
      }, text.length * 30 + 500);

      return () => {
        clearInterval(typingInterval);
        clearTimeout(timeout);
      };
    }
  }, [currentMessage]);

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);

    // Detect if Hindi text
    if (/[ऀ-ॿ]/.test(text)) {
      const availableVoices = window.speechSynthesis.getVoices();
      const hindiVoice = availableVoices.find(v => v.lang === 'hi-IN');
      if (hindiVoice) {
        utterance.voice = hindiVoice;
        utterance.lang = 'hi-IN';
      } else {
        console.warn('No Hindi voice available. Falling back to English.');
        utterance.lang = 'en-US';
      }
    } else {
      utterance.lang = 'en-US';
    }

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [messages, displayText]);

  useEffect(() => {
    if (isListening && isConnected) {
      fetch(`${API_URL}/api/listen`, {
        method: 'POST'
      })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            addMessage(data.error, 'assistant');
          } else {
            addMessage(data.transcription, 'user');
            addMessage(data.response, 'assistant');
          }
        })
        .catch(error => {
          console.error('Error during listening:', error);
          addMessage("Sorry, there was an error processing your voice input.", 'assistant');
        })
        .finally(() => {
          setIsListening(false);
        });
    }
  }, [isListening]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && isConnected && !isLoading) {
      const userMessage = inputText.trim();
      addMessage(userMessage, 'user');
      setInputText('');
      setIsLoading(true);

      try {
        const response = await fetch(`${API_URL}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: userMessage }),
        });

        const data = await response.json();
        if (data.error) {
          addMessage(data.error, 'assistant');
        } else {
          addMessage(data.response, 'assistant');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        addMessage("Sorry, there was an error processing your message.", 'assistant');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatTimestamp = (timestamp: string | Date) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className="w-full bg-black bg-opacity-30 backdrop-blur-md rounded-lg border border-cyan-900 overflow-hidden">
      <div className="flex items-center p-2 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-b border-cyan-900">
        <Terminal size={18} className="text-cyan-400 mr-2" />
        <h3 className="text-cyan-300 font-semibold">Command Console</h3>
        {!isConnected && (
          <div className="ml-auto flex items-center gap-2 text-xs text-red-400">
            <WifiOff size={14} />
            <span>Disconnected</span>
          </div>
        )}
      </div>

      {connectionError && (
        <div className="bg-red-900/30 border-b border-red-700 p-3 text-red-300 text-sm">
          {connectionError}
        </div>
      )}

      <div 
        ref={consoleRef}
        className="h-48 md:h-64 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#0B7285 transparent' }}
      >
        {messages.map((message, index) => (
          <div 
            key={message.id} 
            className={`mb-3 ${message.type === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div 
              className={`inline-block max-w-[85%] px-3 py-2 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-purple-900/50 text-purple-200 rounded-tr-none' 
                  : 'bg-blue-900/50 text-cyan-200 rounded-tl-none'
              }`}
            >
              <div className="text-xs opacity-70 mb-1">
                {message.type === 'user' ? 'YOU' : 'GENIUS'} • {formatTimestamp(message.timestamp)}
              </div>

              <div className="break-words">
                {index === messages.length - 1 && message.type === 'assistant' 
                  ? displayText 
                  : message.text}
                {index === messages.length - 1 && message.type === 'assistant' && currentIndex < message.text.length && (
                  <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-cyan-900/50">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-700" />
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isConnected ? "Type your message..." : "Waiting for server connection..."}
              className="w-full bg-black/30 border border-cyan-900/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-cyan-700 focus:outline-none focus:border-cyan-500"
              disabled={!isConnected || isLoading}
            />
          </div>
          <button
            type="submit"
            className={`p-2 rounded-lg flex items-center justify-center transition-colors ${
              isConnected && !isLoading
                ? 'bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-300' 
                : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isConnected || isLoading}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommandConsole;