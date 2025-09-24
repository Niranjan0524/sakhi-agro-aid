import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function FloatingChatButton() {
  return (
    <Link
      to="/chatbot"
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "w-16 h-16 rounded-full",
        "bg-gradient-primary shadow-large",
        "flex items-center justify-center",
        "transform transition-all duration-300",
        "hover:scale-110 active:scale-95",
        "animate-pulse"
      )}
      aria-label="Open Chatbot"
    >
      <MessageCircle className="w-8 h-8 text-primary-foreground" />
    </Link>
  );
}