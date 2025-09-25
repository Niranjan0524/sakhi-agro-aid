import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft,
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateResponse } from "@/lib/gemini";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function Chatbot() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "നമസ്കാരം! I'm your Krishi Sakhi. How can I help you with your farming today? You can ask me about crops, weather, pest control, or any farming advice! 🌾",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const reply = await generateResponse(userMessage.text);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: reply,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "⚠️ Something went wrong while fetching AI response.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      toast({
        title: "Voice Recording Started",
        description: "Speak in Malayalam or English",
      });
      
      // Simulate voice recording
      setTimeout(() => {
        setIsListening(false);
        setInputText("എന്റെ തക്കാളി ചെടികളിൽ ഇല മഞ്ഞളിക്കുന്നു. എന്താണ് ചെയ്യേണ്ടത്?");
        toast({
          title: "Voice Recorded",
          description: "Tap send to get advice",
        });
      }, 3000);
    } else {
      setIsListening(false);
      toast({
        title: "Recording Stopped",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sky flex flex-col">
      {/* Header */}
      <header className="bg-gradient-primary p-4 shadow-medium">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="text-primary-foreground hover:bg-primary-light/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary-foreground">
                Krishi Sakhi AI
              </h1>
              <p className="text-xs text-primary-foreground/80">Always here to help</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {message.sender === "user" ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Bot className="w-5 h-5" />
                )}
              </div>
              <Card
                className={`max-w-[80%] p-3 shadow-soft ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </Card>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <Card className="p-3 shadow-soft bg-card">
                <div className="flex items-center gap-1">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-background p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <Button
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            onClick={toggleVoiceInput}
            className="flex-shrink-0"
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>
          
          <Input
            placeholder="Type your question or tap mic to speak..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 text-base"
          />
          
          <Button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="max-w-4xl mx-auto mt-3 flex gap-2 overflow-x-auto pb-2">
          {[
            "Weather advice",
            "Pest control",
            "Best crops",
            "Fertilizer tips"
          ].map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => setInputText(suggestion)}
              className="flex-shrink-0 text-xs"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}