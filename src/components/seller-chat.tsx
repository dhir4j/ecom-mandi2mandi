'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, Send, User, Search, Plus, Eye, AlertTriangle, Shield } from 'lucide-react';
import Link from 'next/link';
import { detectContactInfo, getContactWarningMessage } from '@/lib/contact-detection';

// Demo chat conversations
const demoConversations = [
  {
    id: 1,
    buyerName: 'Rajesh Kumar',
    buyerInitials: 'RK',
    productName: 'Wheat (Grade A)',
    lastMessage: 'Can you confirm the delivery date?',
    lastMessageTime: '2 mins ago',
    unreadCount: 2,
    messages: [
      { id: 1, sender: 'buyer', text: 'Hello, I sent an inquiry for 500 Kg wheat', time: '10:30 AM' },
      { id: 2, sender: 'seller', text: 'Yes, I received your inquiry. The product is available.', time: '10:32 AM' },
      { id: 3, sender: 'buyer', text: 'Great! What would be the delivery timeline?', time: '10:35 AM' },
      { id: 4, sender: 'seller', text: 'We can deliver within 3-4 business days from order confirmation.', time: '10:40 AM' },
      { id: 5, sender: 'buyer', text: 'Can you confirm the delivery date?', time: '2 mins ago' },
    ],
  },
  {
    id: 2,
    buyerName: 'Priya Sharma',
    buyerInitials: 'PS',
    productName: 'Rice (Basmati)',
    lastMessage: 'Thank you for the quick delivery!',
    lastMessageTime: '1 hour ago',
    unreadCount: 0,
    messages: [
      { id: 1, sender: 'buyer', text: 'I would like to know about the quality certification', time: '9:15 AM' },
      { id: 2, sender: 'seller', text: 'We have FSSAI certification. I can share the documents.', time: '9:20 AM' },
      { id: 3, sender: 'buyer', text: 'Perfect! Please proceed with the order.', time: '9:25 AM' },
      { id: 4, sender: 'seller', text: 'Order confirmed. We will ship it tomorrow.', time: '9:30 AM' },
      { id: 5, sender: 'buyer', text: 'Thank you for the quick delivery!', time: '1 hour ago' },
    ],
  },
  {
    id: 3,
    buyerName: 'Amit Patel',
    buyerInitials: 'AP',
    productName: 'Turmeric Powder',
    lastMessage: 'Is bulk discount available?',
    lastMessageTime: '3 hours ago',
    unreadCount: 1,
    messages: [
      { id: 1, sender: 'buyer', text: 'I need turmeric powder in bulk. Do you offer discounts?', time: '11:00 AM' },
      { id: 2, sender: 'seller', text: 'Yes, we offer 5% discount on orders above 500 Kg.', time: '11:10 AM' },
      { id: 3, sender: 'buyer', text: 'Is bulk discount available?', time: '3 hours ago' },
    ],
  },
  {
    id: 4,
    buyerName: 'Sunita Desai',
    buyerInitials: 'SD',
    productName: 'Soybean',
    lastMessage: 'Can you share product samples?',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    messages: [
      { id: 1, sender: 'buyer', text: 'Hello, I am interested in your soybean listing.', time: 'Yesterday' },
      { id: 2, sender: 'seller', text: 'Hello! Yes, it is available. What quantity do you need?', time: 'Yesterday' },
      { id: 3, sender: 'buyer', text: 'Can you share product samples?', time: 'Yesterday' },
    ],
  },
];

export function SellerChat() {
  const [showDemo, setShowDemo] = useState(false);
  const [conversations] = useState(demoConversations);
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState(selectedConversation.messages);
  const [contactWarning, setContactWarning] = useState<string>('');

  // Check if user has any chats (in real app, this would come from API)
  const hasChats = false; // Set to true when user has actual chats

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Check for contact information
    const contactCheck = detectContactInfo(newMessage);

    if (contactCheck.hasContact) {
      const warningMsg = getContactWarningMessage(contactCheck.types);
      setContactWarning(warningMsg);

      // Block sending if severity is high (phone numbers or emails)
      if (contactCheck.severity === 'high') {
        setTimeout(() => setContactWarning(''), 8000);
        return;
      }

      // For medium severity, allow but warn
      setTimeout(() => setContactWarning(''), 6000);
    }

    const message = {
      id: messages.length + 1,
      sender: 'seller' as const,
      text: newMessage,
      time: 'Just now',
    };

    setMessages([...messages, message]);
    setNewMessage('');
    setContactWarning('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectConversation = (conversation: typeof demoConversations[0]) => {
    setSelectedConversation(conversation);
    setMessages(conversation.messages);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!hasChats && !showDemo) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-muted rounded-full p-6 mb-4">
            <MessageSquare className="w-16 h-16 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">No Messages Yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Once you receive enquiries from buyers, you can chat with them here to discuss product details, pricing, and delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg">
              <Link href="?tab=add-product">
                <Plus className="mr-2 h-5 w-5" />
                List Your Products
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={() => setShowDemo(true)}>
              <Eye className="mr-2 h-5 w-5" />
              View Demo Chats
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {showDemo && !hasChats && (
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                You're viewing demo conversations. List products and receive enquiries to start chatting with buyers.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowDemo(false)}>
              Hide Demo
            </Button>
          </CardContent>
        </Card>
      )}
      <Card className="h-[calc(100vh-12rem)] sm:h-[calc(100vh-16rem)]">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          {/* Conversations List */}
          <div className="hidden md:flex md:col-span-1 border-r flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Messages</CardTitle>
              <CardDescription>Chat with your buyers</CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <ScrollArea className="flex-1 px-3">
              <div className="space-y-2 pb-4">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => selectConversation(conversation)}
                    className={`w-full text-left p-3 rounded-lg transition-colors hover:bg-accent ${
                      selectedConversation.id === conversation.id ? 'bg-accent' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {conversation.buyerInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-sm truncate">{conversation.buyerName}</p>
                          {conversation.unreadCount > 0 && (
                            <Badge className="ml-2 h-5 min-w-5 flex items-center justify-center bg-primary text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mb-1">
                          {conversation.productName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {conversation.lastMessageTime}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="col-span-1 md:col-span-2 flex flex-col">
            {/* Mobile: Show conversation selector */}
            <div className="md:hidden border-b p-3">
              <select
                className="w-full text-sm border rounded-md p-2"
                value={selectedConversation.id}
                onChange={(e) => {
                  const conv = conversations.find(c => c.id === Number(e.target.value));
                  if (conv) selectConversation(conv);
                }}
              >
                {filteredConversations.map((conv) => (
                  <option key={conv.id} value={conv.id}>
                    {conv.buyerName} - {conv.productName}
                  </option>
                ))}
              </select>
            </div>

            <CardHeader className="pb-3 border-b px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs sm:text-sm">
                    {selectedConversation.buyerInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-sm sm:text-lg truncate">{selectedConversation.buyerName}</CardTitle>
                  <CardDescription className="text-[10px] sm:text-xs truncate">
                    Inquiry: {selectedConversation.productName}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1 p-3 sm:p-4">
              <div className="space-y-3 sm:space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'seller' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] rounded-lg px-3 sm:px-4 py-2 ${
                        message.sender === 'seller'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm break-words">{message.text}</p>
                      <p
                        className={`text-[10px] sm:text-xs mt-1 ${
                          message.sender === 'seller'
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Contact Warning Banner */}
            {contactWarning && (
              <div className="px-3 sm:px-4 pt-3">
                <Alert variant="destructive" className="border-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs sm:text-sm">
                    {contactWarning}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <div className="p-3 sm:p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 text-sm sm:text-base"
                />
                <Button onClick={handleSendMessage} size="icon" className="h-10 w-10 flex-shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
