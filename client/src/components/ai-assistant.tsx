import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAIChat } from "../hooks/use-ai-chat";
import { Bot, X, Send, Lightbulb, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { sendMessage, conversations, isLoading } = useAIChat();

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    await sendMessage(message);
    setMessage("");
  };

  const handleQuickAction = (action: string) => {
    setMessage(action);
    handleSendMessage();
  };

  return (
    <>
      {/* Floating AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="ai-gradient w-16 h-16 rounded-full shadow-2xl text-white hover:scale-110 transition-transform animate-pulse-slow"
          data-testid="button-toggle-ai"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>

      {/* AI Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-80 z-50"
            data-testid="ai-chat-interface"
          >
            <Card className="shadow-2xl border-gray-200">
              {/* Header */}
              <div className="ai-gradient p-4 rounded-t-xl text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bot className="mr-2 h-5 w-5" />
                    <span className="font-semibold">AI Business Assistant</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-gray-200 p-1"
                    data-testid="button-close-ai"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Chat Messages */}
              <CardContent className="p-0">
                <div className="h-64 overflow-y-auto p-4 space-y-3" data-testid="chat-messages">
                  {conversations.length === 0 ? (
                    <div className="space-y-3">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-sm">
                          Hi! I'm your AI business assistant. How can I help you grow your business today?
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAction("Give me marketing tips for my small business")}
                          className="text-xs"
                          data-testid="button-marketing-tips"
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Marketing Tips
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAction("Help me find collaboration partners")}
                          className="text-xs"
                          data-testid="button-find-partners"
                        >
                          <Lightbulb className="h-3 w-3 mr-1" />
                          Find Partners
                        </Button>
                      </div>
                    </div>
                  ) : (
                    conversations.map((conv, index) => (
                      <div key={index} className="space-y-2">
                        {/* User Message */}
                        <div className="flex justify-end">
                          <div className="bg-primary text-white p-3 rounded-lg max-w-[80%] text-sm">
                            {conv.message}
                          </div>
                        </div>
                        
                        {/* AI Response */}
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <p className="text-sm mb-2">{conv.response}</p>
                          
                          {/* Suggestions */}
                          {conv.suggestions && conv.suggestions.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-semibold text-gray-600 mb-1">Suggestions:</p>
                              <ul className="text-xs space-y-1">
                                {conv.suggestions.map((suggestion, i) => (
                                  <li key={i} className="text-gray-700">• {suggestion}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {/* Action Items */}
                          {conv.actionItems && conv.actionItems.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-semibold text-gray-600 mb-1">Action Items:</p>
                              <ul className="text-xs space-y-1">
                                {conv.actionItems.map((item, i) => (
                                  <li key={i} className="text-gray-700">✓ {item}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  
                  {isLoading && (
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">AI is thinking...</p>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Ask me anything..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="text-sm"
                      disabled={isLoading}
                      data-testid="input-ai-message"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isLoading}
                      className="bg-ai-purple hover:bg-purple-600"
                      data-testid="button-send-message"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
