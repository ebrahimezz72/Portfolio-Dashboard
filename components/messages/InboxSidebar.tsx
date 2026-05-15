import React from "react";

interface MessageItem {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  status: "NEW" | "READ" | "REPLIED";
}

interface InboxSidebarProps {
  messages: MessageItem[];
  activeId: string;
  onSelect?: (id: string) => void;
}

export default function InboxSidebar({ messages, activeId, onSelect }: InboxSidebarProps) {
  return (
    <div className="w-full lg:w-96 border-r border-border min-h-[900px] flex flex-col">
      <div className="p-6 space-y-6">
        <div>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-1">COMMUNICATION</p>
          <h2 className="text-2xl font-bold text-white tracking-tight">Inquiry Inbox</h2>
        </div>
        
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-sm">
          {["ALL", "UNREAD", "ARCHIVED"].map((filter) => (
            <button 
              key={filter}
              className={`flex-1 py-1.5 text-[10px] font-bold tracking-widest rounded-sm transition-all ${
                filter === "ALL" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 divide-y divide-border/50">
        {messages.map((msg) => {
          const isActive = msg.id === activeId;
          return (
            <div 
              key={msg.id}
              onClick={() => onSelect?.(msg.id)}
              className={`p-6 cursor-pointer transition-all relative border-l-2 ${
                isActive 
                  ? "bg-white/[0.03] border-accent" 
                  : "hover:bg-white/[0.01] border-transparent"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[9px] font-black tracking-tighter uppercase ${
                  msg.status === "NEW" ? "text-accent" : "text-muted-foreground"
                }`}>
                  {msg.status === "NEW" ? "NEW INQUIRY" : msg.status}
                </span>
                <span className="text-[10px] text-muted-foreground">{msg.time}</span>
              </div>
              <h3 className={`text-sm font-bold mb-1 ${isActive ? "text-accent" : "text-white"}`}>
                {msg.sender}
              </h3>
              <p className="text-xs text-white/80 font-medium mb-2 truncate">{msg.subject}</p>
              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                {msg.preview}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
