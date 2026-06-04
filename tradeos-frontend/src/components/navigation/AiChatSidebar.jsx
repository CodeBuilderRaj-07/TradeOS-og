import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import API from "@/services/api";

const SYSTEM_PROMPT = {
  role: "system",
  content: "You are a professional trading assistant. Help users with trading concepts, risk management, market analysis, and trading psychology. Be concise and practical.",
};

export default function AiChatSidebar({ open, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI trading assistant. Ask me anything about trading, risk management, or market analysis." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
    }
  }, [input]);

  useEffect(() => {
    const onFocus = () => setTimeout(() => setIsKeyboardOpen(true), 300);
    const onBlur = () => setIsKeyboardOpen(false);
    window.addEventListener("focusin", onFocus);
    window.addEventListener("focusout", onBlur);
    return () => {
      window.removeEventListener("focusin", onFocus);
      window.removeEventListener("focusout", onBlur);
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const apiMessages = [SYSTEM_PROMPT, ...updatedMessages.map(({ role, content }) => ({ role, content }))];

    try {
      const res = await API.post("/deepseek/chat", { messages: apiMessages });
      const aiText = res.data?.response || "Sorry, I couldn't process that.";
      setMessages((prev) => [...prev, { role: "assistant", content: aiText }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-background shadow-2xl ${
              isKeyboardOpen ? "inset-0" : "top-0 h-full"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Bot size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">AI Trading Assistant</h2>
                  <p className="text-[10px] text-muted-foreground">DeepSeek V4 Flash</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      msg.role === "user" ? "bg-primary/10 text-primary" : "bg-sidebar-accent text-sidebar-accent-foreground"
                    }`}
                  >
                    {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/90"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent">
                    <Bot size={14} />
                  </div>
                  <div className="rounded-xl border border-border bg-card px-4 py-2.5">
                    <Loader2 size={14} className="animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border bg-background pb-safe">
              <div className="flex items-end gap-2 p-3 md:p-4">
                <div className="relative flex-1">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about trading..."
                    rows={1}
                    className="min-h-[44px] w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 pr-11 text-sm text-foreground outline-none transition-all focus:border-primary/40 focus:shadow-[0_0_20px_hsl(var(--primary)/0.08)] placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    className="absolute bottom-1.5 right-1.5 flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
