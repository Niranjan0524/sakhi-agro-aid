import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { generateResponse, isGeminiConfigured } from '@/lib/gemini';
import { Loader2, Send, AlertCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function GeminiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    if (!isGeminiConfigured()) {
      setError('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: prompt,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await generateResponse(prompt);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            കൃഷി സഖി - Krishi Sakhi
          </CardTitle>
          <p className="text-muted-foreground text-center">
            Kerala farming advisor powered by AI
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Display */}
          {error && (
            <Card className="border-destructive/50 bg-destructive/10">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chat Messages */}
          <div className="space-y-3 min-h-[300px] max-h-[500px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>Ask me anything about farming in Malayalam!</p>
                <p className="text-sm mt-2">
                  Example: "എന്റെ നെല്ലിന് എന്ത് രോഗമാണ്?" or "ഇന്ന് മഴ ഉണ്ടാകുമോ?"
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <Card
                  key={message.id}
                  className={`${
                    message.type === 'user'
                      ? 'ml-auto bg-primary text-primary-foreground'
                      : 'mr-auto bg-muted'
                  } max-w-[80%]`}
                >
                  <CardContent className="p-3">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            
            {/* Loading Indicator */}
            {isLoading && (
              <Card className="mr-auto bg-muted max-w-[80%]">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">കൃഷി സഖി ചിന്തിക്കുന്നു...</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask about farming... (Malayalam/English)"
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !prompt.trim()}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>

          {/* API Status */}
          <div className="text-xs text-muted-foreground text-center">
            Status: {isGeminiConfigured() ? (
              <span className="text-green-600">API Connected</span>
            ) : (
              <span className="text-red-600">API Key Required</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}