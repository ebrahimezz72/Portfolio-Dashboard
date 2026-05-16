import React from "react";
import { Search } from "lucide-react";

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
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onSelect?: (id: string) => void;
}

export default function InboxSidebar({ messages, activeId, activeFilter, onFilterChange, onSelect }: InboxSidebarProps) {
  const [localSearch, setLocalSearch] = React.useState("");

  const visibleMessages = messages.filter(msg => {
    if (!localSearch.trim()) return true;
    const q = localSearch.toLowerCase();
    return (
      msg.sender?.toLowerCase().includes(q) ||
      msg.subject?.toLowerCase().includes(q) ||
      msg.preview?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full lg:w-96 border-r border-border min-h-[900px] flex flex-col">
      <div className="p-6 space-y-4">
        <div>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em] mb-1">COMMUNICATION</p>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Inquiry Inbox</h2>
        </div>

        {/* Local Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search senders, subjects..."
            className="w-full bg-foreground/5 border border-transparent py-2 pl-9 pr-4 rounded-sm text-xs font-medium text-foreground focus:outline-none focus:border-accent transition-all placeholder:text-muted-foreground"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 p-1 bg-foreground/5 rounded-sm">
          {["ALL", "NEW", "READ"].map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`flex-1 py-1.5 text-[10px] font-bold tracking-widest rounded-sm transition-all ${
                activeFilter === filter ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {visibleMessages.length} {visibleMessages.length === 1 ? "Result" : "Results"}
        </p>
      </div>

      <div className="flex-1 divide-y divide-border/50 overflow-y-auto">
        {visibleMessages.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">No messages match your search</p>
          </div>
        ) : (
          visibleMessages.map((msg) => {
            const isActive = msg.id === activeId;
            return (
              <div
                key={msg.id}
                onClick={() => onSelect?.(msg.id)}
                className={`p-6 cursor-pointer transition-all relative border-l-2 ${
                  isActive
                    ? "bg-foreground/[0.03] border-accent"
                    : "hover:bg-foreground/[0.01] border-transparent"
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
                <h3 className={`text-sm font-bold mb-1 ${isActive ? "text-accent" : "text-foreground"}`}>
                  {msg.sender}
                </h3>
                <p className="text-xs text-foreground/80 font-medium mb-2 truncate">{msg.subject}</p>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {msg.preview}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
