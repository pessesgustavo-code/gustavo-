import React, { useState, useRef, useEffect } from 'react';
import { Music, Activity, HelpCircle, FileAudio } from 'lucide-react';
import { Message, Role } from './types';
import { sendMessage, initializeChat } from './services/geminiService';
import MessageBubble from './components/MessageBubble';
import ChatInput from './components/ChatInput';
import QuickActions from './components/QuickActions';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Chat Session on Mount
  useEffect(() => {
    const init = async () => {
      try {
        await initializeChat();
        setIsInitialized(true);
      } catch (e) {
        console.error("Initialization failed", e);
      }
    };
    init();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string, image?: string) => {
    if (!text.trim() && !image) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content: text,
      image: image,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Pass both text and image to the service
      const responseText = await sendMessage(text || "Analise esta imagem.", image);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        content: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        content: "Desculpe, encontrei um erro de conexão. Por favor, verifique sua internet ou tente novamente em alguns instantes.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="flex-shrink-0 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg shadow-orange-900/20">
              <Activity className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white">AudioTech Pro</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-gray-400 font-medium">Support AI Online</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4 text-xs font-medium text-gray-500">
             <div className="flex items-center gap-1">
                <Music size={14} /> Logic Pro
             </div>
             <div className="flex items-center gap-1">
                <FileAudio size={14} /> Pro Tools
             </div>
             <div className="flex items-center gap-1">
                <HelpCircle size={14} /> macOS Support
             </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto scroll-smooth relative">
        <div className="max-w-4xl mx-auto px-4 py-8">
          
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-in fade-in duration-700">
              <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center border border-gray-800 mb-2">
                 <Activity size={40} className="text-gray-600" />
              </div>
              <div className="max-w-lg">
                <h2 className="text-2xl font-semibold text-white mb-2">Como posso ajudar seu estúdio hoje?</h2>
                <p className="text-gray-400 text-sm">
                  Sou seu especialista em Apple e Produção Musical. 
                  Envie fotos da tela, erros ou dúvidas sobre DAWs.
                </p>
              </div>
              
              <QuickActions onSelect={(text) => handleSend(text)} />
            </div>
          )}

          {/* Messages */}
          <div className="space-y-2">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            
            {isLoading && (
              <div className="flex justify-start w-full mb-6 animate-pulse">
                <div className="flex flex-row items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-600/50 flex items-center justify-center">
                    <Activity size={16} className="text-white/50" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-gray-800/50 border border-gray-700/50 rounded-tl-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};

export default App;