import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// AI Assistant — coming soon. The ShareSmallBiz API does not currently expose
// an AI chat endpoint. This component renders the UI shell as a placeholder.
export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="ai-gradient w-16 h-16 rounded-full shadow-2xl text-white hover:scale-110 transition-transform"
          data-testid="button-toggle-ai"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>

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
              <CardContent className="p-6 text-center">
                <Bot className="h-12 w-12 text-ai-purple mx-auto mb-3 opacity-40" />
                <p className="text-gray-600 text-sm">
                  AI Business Assistant coming soon. Stay tuned for smart
                  insights and business advice powered by AI.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
