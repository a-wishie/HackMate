import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

const Chat = ({ match }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages([
      ...messages,
      {
        id: Date.now(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date(),
      },
    ]);
    setNewMessage('');
  };

  return (
    <Card className="max-w-2xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center gap-4">
          <img
            src={match.profile_picture || "/api/placeholder/40/40"}
            alt={match.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold">{match.name}</h3>
            <p className="text-sm text-gray-600">
              {match.skills.slice(0, 2).join(', ')}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                <p>{message.text}</p>
                <span className="text-xs opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <CardFooter className="border-t p-4">
        <form onSubmit={handleSend} className="flex w-full gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default Chat;