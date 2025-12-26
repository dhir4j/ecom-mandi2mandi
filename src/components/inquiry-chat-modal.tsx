'use client';

import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Check, CheckCheck } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import type { Product } from '@/lib/types';

type InquiryChatModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
};

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'seller';
  timestamp: Date;
  status: 'sent' | 'delivered';
};

export function InquiryChatModal({ open, onOpenChange, product }: InquiryChatModalProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Add initial greeting message when modal opens
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: 'greeting',
          text: `Hi! I'm interested in your ${product.title}. Please share more details.`,
          sender: 'user',
          timestamp: new Date(),
          status: 'sent',
        },
      ]);
    }
  }, [open, product.title, messages.length]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      text: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsSending(true);

    // Simulate sending message
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: 'delivered' as const } : msg
        )
      );
      setIsSending(false);

      // Show success feedback after a short delay
      setTimeout(() => {
        // You can add a toast notification here
        console.log('Message successfully sent to seller');
      }, 500);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSellerInitials = () => {
    return product.seller
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md h-[95vh] sm:h-[85vh] p-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-3 sm:px-4 py-3 border-b bg-muted/30">
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs sm:text-sm">
                {getSellerInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-sm sm:text-base truncate">{product.seller}</DialogTitle>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                {product.title}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Messages Area */}
        <ScrollArea className="flex-1 px-3 sm:px-4 py-3" ref={scrollRef}>
          <div className="space-y-2 sm:space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 sm:px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed break-words">{message.text}</p>
                  <div className="flex items-center gap-1 mt-1 justify-end">
                    <span className="text-[10px] opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {message.sender === 'user' && (
                      <span className="opacity-70">
                        {message.status === 'delivered' ? (
                          <CheckCheck className="h-3 w-3" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Sending indicator */}
            {isSending && (
              <div className="flex justify-end">
                <div className="bg-primary/10 text-primary rounded-2xl px-3 sm:px-4 py-2 rounded-br-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="px-3 sm:px-4 py-3 border-t bg-background">
          <div className="flex items-end gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 rounded-full text-sm sm:text-base"
              disabled={isSending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isSending}
              size="icon"
              className="rounded-full h-10 w-10 flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            Messages are sent directly to the seller
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
