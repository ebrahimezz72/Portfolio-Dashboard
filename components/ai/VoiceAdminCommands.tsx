"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2, X, Volume2, Globe } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

export default function VoiceAdminCommands() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<"en-US" | "ar-SA">("en-US");
  
  const router = useRouter();
  const pathname = usePathname();
  const { toggleTheme } = useTheme();
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcriptValue = event.results[current][0].transcript;
          setTranscript(transcriptValue);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          if (transcript) {
            handleVoiceCommand(transcript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setError("Speech recognition error: " + event.error);
          setIsListening(false);
        };
      }
    }
  }, [transcript]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setError(null);
      setResponse(null);
      setTranscript("");
      recognitionRef.current.lang = lang;
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleVoiceCommand = async (text: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/ai/voice-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: text,
          currentPath: pathname,
          language: lang === "ar-SA" ? "Arabic" : "English"
        }),
      });

      const data = await res.json();
      setResponse(data.speech_response);

      // Execute Action
      if (data.action === "navigate") {
        router.push(data.target);
      } else if (data.action === "toggle_theme") {
        toggleTheme();
      } else if (data.action === "logout") {
        // Handle logout
      }

      // Speak back
      speak(data.speech_response);

    } catch (err) {
      setError("Failed to process command");
    } finally {
      setIsProcessing(false);
    }
  };

  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="relative flex items-center">
      <div className="flex items-center gap-2 mr-4">
        <button 
          onClick={() => setLang(lang === "en-US" ? "ar-SA" : "en-US")}
          className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors flex items-center gap-1"
        >
          <Globe size={12} />
          {lang.split("-")[0]}
        </button>
      </div>

      <button
        onClick={toggleListening}
        className={`p-3 rounded-full transition-all relative ${
          isListening 
            ? "bg-red-500 text-white animate-pulse" 
            : "bg-foreground/5 text-muted-foreground hover:text-accent hover:bg-accent/10 border border-border"
        }`}
      >
        {isListening ? <Mic size={20} /> : <MicOff size={20} />}
        
        {isListening && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </button>

      {/* Voice Status Overlay */}
      {(isListening || transcript || isProcessing || response) && (
        <div className="absolute top-full right-0 mt-4 w-72 bg-card border border-border shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 z-[60]">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-accent">Voice Assistant</h4>
            <button onClick={() => { setTranscript(""); setResponse(null); }} className="text-muted-foreground hover:text-foreground">
              <X size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {transcript && (
              <div className="bg-foreground/5 p-3 border border-border">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">You said</p>
                <p className="text-xs text-foreground font-medium italic">"{transcript}"</p>
              </div>
            )}

            {isProcessing && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 size={14} className="animate-spin text-accent" />
                Thinking...
              </div>
            )}

            {response && (
              <div className="bg-accent/5 p-3 border border-accent/20">
                <div className="flex items-center gap-2 mb-1">
                  <Volume2 size={12} className="text-accent" />
                  <p className="text-[10px] text-accent uppercase tracking-widest font-black">Response</p>
                </div>
                <p className="text-xs text-foreground font-bold">{response}</p>
              </div>
            )}

            {error && (
              <p className="text-[10px] text-red-500 uppercase tracking-widest font-bold">{error}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
