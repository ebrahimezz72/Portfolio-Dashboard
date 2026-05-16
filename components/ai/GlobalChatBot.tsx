"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  Loader2, 
  User, 
  Bot,
  ChevronRight,
  Maximize2,
  Minimize2
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface Message {
  role: "user" | "bot";
  content: string;
  type: "text" | "voice";
}

export default function GlobalChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hello! I'm your Artisan Assistant. How can I help you today?", type: "text" }
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lang, setLang] = useState<"en" | "ar">("en");
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          handleSend(transcript, "voice");
        };

        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, []);

  const handleSend = async (text: string, type: "text" | "voice" = "text") => {
    if (!text.trim()) return;

    const newMessage: Message = { role: "user", content: text, type };
    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-5),
          currentPath: pathname,
          language: lang === "en" ? "English" : "Arabic"
        }),
      });

      const data = await response.json();
      const botMessage: Message = { role: "bot", content: data.response, type: "text" };
      setMessages(prev => [...prev, botMessage]);

      if (type === "voice" || data.voice_hint) {
        speak(data.voice_hint || data.response);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "bot", content: "Sorry, I'm having trouble connecting right now.", type: "text" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "en" ? "en-US" : "ar-SA";
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current.lang = lang === "en" ? "en-US" : "ar-SA";
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-accent text-accent-foreground shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[100] group"
      >
        <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-20 group-hover:opacity-40"></div>
        <Sparkles size={28} className="animate-pulse" />
      </button>
    );
  }

  return (
    <div 
      className={`fixed right-6 bottom-6 w-96 bg-card border border-border shadow-2xl flex flex-col transition-all z-[100] overflow-hidden ${
        isMinimized ? "h-16" : "h-[600px]"
      }`}
    >
      {/* Header */}
      <div className="bg-accent p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-accent-foreground">
          <div className="p-2 bg-white/10 rounded-sm">
            <Bot size={18} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest">Artisan Assistant</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[9px] font-bold uppercase opacity-70">AI Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-white/10 text-accent-foreground/70 hover:text-accent-foreground transition-all">
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 text-accent-foreground/70 hover:text-accent-foreground transition-all">
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-foreground/[0.01]"
          >
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-sm shrink-0 flex items-center justify-center border ${
                    msg.role === 'user' ? 'bg-foreground/5 border-border text-muted-foreground' : 'bg-accent/10 border-accent/20 text-accent'
                  }`}>
                    {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                  </div>
                  <div className={`p-3 rounded-sm text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-foreground/5 text-foreground border border-border' 
                      : 'bg-card border border-border text-foreground'
                  }`}>
                    {msg.content}
                    {msg.type === 'voice' && (
                      <div className="mt-2 flex items-center gap-1 text-[9px] text-muted-foreground uppercase font-bold">
                        <Volume2 size={10} /> Voice Input
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border p-3 rounded-sm flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-accent" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Input */}
          <div className="p-4 border-t border-border bg-foreground/[0.02] space-y-3">
            <div className="flex gap-2">
              <button
                onClick={toggleMic}
                className={`p-3 rounded-sm border transition-all ${
                  isListening 
                    ? "bg-red-500 border-red-400 text-white animate-pulse" 
                    : "bg-card border-border text-muted-foreground hover:text-accent hover:border-accent"
                }`}
              >
                {isListening ? <Mic size={18} /> : <MicOff size={18} />}
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                  placeholder={lang === 'en' ? "Type or use voice..." : "اكتب أو استخدم صوتك..."}
                  className="w-full h-full bg-card border border-border px-4 pr-12 text-xs outline-none focus:border-accent transition-all"
                />
                <button 
                  onClick={() => handleSend(input)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-accent transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors flex items-center gap-1"
              >
                {lang === 'en' ? "English" : "العربية"}
              </button>
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-[0.2em]">Artisan AI v1.0</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
