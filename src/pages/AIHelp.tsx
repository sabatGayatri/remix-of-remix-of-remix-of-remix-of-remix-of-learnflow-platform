import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Bot, User, Sparkles, BookOpen } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "Hi! I noticed you had trouble understanding the Two Sum solution. Let me break it down step by step.\n\nThe key insight is using a **hash map** to store previously seen numbers. Instead of checking all pairs (O(n²)), we check if the complement exists in O(1) time.\n\nWhich part would you like me to explain further?",
  },
];

const AIHelp = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
    };
    
    const aiResponse: Message = {
      id: messages.length + 2,
      role: "assistant",
      content: "Great question! Let me explain...\n\nWhen we iterate through the array, for each number `num`, we calculate `complement = target - num`. We then check if this complement exists in our hash map.\n\nIf it does, we found our pair! If not, we add the current number to the hash map and continue.\n\nWould you like me to show you a visual example with actual numbers?",
    };
    
    setMessages([...messages, userMessage, aiResponse]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 h-16 glass z-50 border-b border-border">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link
            to="/solve/1"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Problem
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">AI Assistant</span>
          </div>

          <Link to="/basics/hashing">
            <Button variant="outline" size="sm" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Learn Basics
            </Button>
          </Link>
        </div>
      </div>

      {/* Chat area */}
      <main className="flex-1 pt-20 pb-24 px-4 overflow-y-auto">
        <div className="container mx-auto max-w-3xl space-y-6">
          {/* Context banner */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium text-sm">Analyzing: Two Sum Problem</span>
            </div>
            <p className="text-xs text-muted-foreground">
              AI has access to the video transcription and will provide step-by-step explanations.
            </p>
          </div>

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                message.role === "assistant" 
                  ? "gradient-hero" 
                  : "bg-muted"
              }`}>
                {message.role === "assistant" ? (
                  <Bot className="w-5 h-5 text-white" />
                ) : (
                  <User className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}>
                <div className={`inline-block p-4 rounded-2xl ${
                  message.role === "assistant"
                    ? "bg-card border border-border text-left"
                    : "bg-primary text-primary-foreground"
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Suggested questions */}
          <div className="flex flex-wrap gap-2 justify-center pt-4">
            {[
              "Why use a hash map?",
              "Show me an example",
              "What's the time complexity?",
              "Explain step 3 again",
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInput(suggestion)}
                className="px-4 py-2 rounded-full bg-muted text-sm hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Input area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-border">
        <div className="container mx-auto max-w-3xl">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask a question about the solution..."
              className="h-12"
            />
            <Button
              variant="default"
              size="icon"
              className="h-12 w-12 flex-shrink-0"
              onClick={handleSend}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            AI may make mistakes. If you're still confused,{" "}
            <Link to="/basics/hashing" className="text-primary hover:underline">
              try learning the basics first
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIHelp;
