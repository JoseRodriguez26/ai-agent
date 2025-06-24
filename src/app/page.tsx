"use client";
import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  sender: "user" | "ai";
  text: string;
}

const AVATARS = {
  user: (
    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold shadow-md">
      U
    </div>
  ),
  ai: (
    <img
      src="/elon.jpg"
      alt="Elon Musk"
      className="w-8 h-8 rounded-full object-cover shadow-md border-2 border-gray-900"
    />
  ),
};

const AGENT_NAMES = [
  "GPT-4 Turbo",
  "Gemini Pro",
  "Claude 3 Opus",
  "Llama 3",
  "Mistral Large",
  "GPT-3.5",
  "Gemini Nano",
  "Claude 3 Sonnet",
  "Llama 2",
  "Mistral Small",
  "GPT-4o",
  "Gemini Ultra",
  "Claude 2",
  "Llama Chat",
  "Mistral Medium",
  "GPT-3",
  "Gemini Flash",
  "Claude Instant",
  "Llama Code",
  "Mistral Tiny"
];

function AgentCard({ agentId }: { agentId: number }) {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: `Hello! I am AI Agent #${agentId + 1}. How can I help you today?` },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const agentName = AGENT_NAMES[agentId % AGENT_NAMES.length];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { sender: "user" as const, text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: `Agent #${agentId + 1} says: You said: "${userMessage.text}"` },
      ]);
    }, 700);
  }

  return (
    <Card className="flex flex-col h-80 w-full max-w-xs mx-auto bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-none">
      <div className="mb-2 text-center font-semibold text-white text-base tracking-wide">
        {agentName}
      </div>
      <div className="flex-1 overflow-y-auto space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "ai" && AVATARS.ai}
            <div
              className={`px-3 py-2 rounded-lg max-w-[75%] text-sm transition-all duration-200 ${
                msg.sender === "user"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-800 text-gray-100"
              }`}
            >
              {msg.text}
            </div>
            {msg.sender === "user" && AVATARS.user}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSend}
        className="flex gap-2 pt-3 border-t border-gray-800 mt-3"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 text-sm bg-gray-800 text-white border-gray-700"
          aria-label="Message input"
        />
        <Button type="submit" className="shrink-0 text-sm px-4 bg-gray-700 hover:bg-gray-600 text-white border-none" disabled={!input.trim()}>
          Send
        </Button>
      </form>
    </Card>
  );
}

function GoogleSearchTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);
    try {
      setTimeout(() => {
        setResults([
          { title: `Result for "${query}"`, link: "https://www.google.com/search?q=" + encodeURIComponent(query), snippet: "This is a placeholder result. Integrate Google Custom Search API for real results." },
        ]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Failed to fetch results.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search Google..."
          className="flex-1 bg-gray-800 text-white border-gray-700"
        />
        <Button type="submit" className="bg-gray-700 hover:bg-gray-600 text-white border-none">Search</Button>
      </form>
      {loading && <div className="text-center text-gray-400">Searching...</div>}
      {error && <div className="text-center text-red-400">{error}</div>}
      {results.length > 0 && (
        <Card className="p-4 mt-4 bg-gray-900 border-gray-800 text-white">
          {results.map((r, i) => (
            <div key={i} className="mb-4">
              <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 font-semibold hover:underline">{r.title}</a>
              <div className="text-gray-400 text-sm mt-1">{r.snippet}</div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState<'agents' | 'google'>('agents');
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 p-4 font-sans">
      {/* Tab Bar */}
      <div className="flex justify-center mt-4 mb-8 gap-2">
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold transition-colors ${tab === 'agents' ? 'bg-gray-900 shadow text-white' : 'bg-gray-800 text-gray-400'}`}
          onClick={() => setTab('agents')}
        >
          AI Agents
        </button>
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold transition-colors ${tab === 'google' ? 'bg-gray-900 shadow text-white' : 'bg-gray-800 text-gray-400'}`}
          onClick={() => setTab('google')}
        >
          Google Search
        </button>
      </div>
      {/* Tab Content */}
      {tab === 'agents' ? (
        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <AgentCard key={i} agentId={i} />
          ))}
        </div>
      ) : (
        <GoogleSearchTab />
      )}
      <div className="mt-6 text-xs text-gray-500 text-center">
        Powered by Next.js, Tailwind CSS, and shadcn/ui
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 0.4s;
        }
      `}</style>
    </div>
  );
}
