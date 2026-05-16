"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, X, Sparkles, MessageCircle } from "lucide-react";

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event: any) => {
          const transcriptValue = event.results[0][0].transcript;
          setTranscript(transcriptValue);
          handleQuery(transcriptValue);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const toggleAssistant = () => {
    if (!isOpen) {
      setIsOpen(true);
      // Optional: auto start listening?
    } else {
      setIsOpen(false);
      setAnswer(null);
      setTranscript("");
    }
  };

  const startListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setAnswer(null);
      setTranscript("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleQuery = async (text: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/ai/visitor-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text, language: "English" }),
      });
      const data = await res.json();
      setAnswer(data.answer);
      speak(data.answer);
    } catch (err) {
      console.error("AI Assistant error", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {/* Assistant Modal */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-background border border-border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-accent p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-accent-foreground">
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Artisan AI Assistant</span>
            </div>
            <button onClick={toggleAssistant} className="text-accent-foreground/50 hover:text-accent-foreground">
              <X size={16} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {transcript && (
              <div className="bg-foreground/5 p-3 border border-border rounded-sm">
                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">You</p>
                <p className="text-xs italic">"{transcript}"</p>
              </div>
            )}

            {isProcessing && (
              <div className="flex items-center gap-2 text-[10px] font-bold text-accent animate-pulse uppercase tracking-widest">
                <Sparkles size={14} /> Processing your request...
              </div>
            )}

            {answer && (
              <div className="bg-accent/5 p-4 border border-accent/20 rounded-sm">
                <p className="text-[10px] text-accent uppercase font-bold mb-1">Assistant</p>
                <p className="text-xs text-foreground leading-relaxed">{answer}</p>
              </div>
            )}

            <div className="flex justify-center pt-4">
              <button
                onClick={startListening}
                disabled={isProcessing}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  isListening 
                    ? "bg-red-500 text-white animate-pulse" 
                    : "bg-accent text-accent-foreground hover:scale-105 active:scale-95"
                } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isListening ? <Mic size={24} /> : <MessageCircle size={24} />}
              </button>
            </div>
            <p className="text-center text-[9px] text-muted-foreground uppercase tracking-widest font-bold">
              {isListening ? "Listening..." : "Click to speak"}
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleAssistant}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 ${
          isOpen ? "bg-foreground text-background" : "bg-accent text-accent-foreground"
        } relative group`}
      >
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-20 group-hover:opacity-40"></span>
        )}
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>
    </div>
  );
}
