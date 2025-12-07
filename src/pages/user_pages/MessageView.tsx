import { checkProfileComplete } from '@/lib/utils';
import { ArrowLeft, Send } from 'lucide-react';
// import type { Conversation, Message } from '../lib/supabase';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CompleteProfile from './CompleteProfile';

type Conversation = {
  id: number;
  // name: string;
  listing: { id: number; title: string, userId: number };
  avatar: string;
  participant1: { id: string; name: string };
  participant2: { id: string; name: string };
  // last_message: string;
  // last_message_time: string;
  created_at: string;
};

type Message = {
  // id: string;
  // conversation_id: string;
  // content: string;
  // is_from_me: boolean;
  // created_at: string;

  id: number;
  content: string;
  sender: { id: string; name: string };
  createdAt: string;
};

type MessageViewProps = {
  conversation: Conversation | null;
  messages: Message[];
  onBack: () => void;
  onSendMessage: (content: string) => void;
};

export default function MessageView({ conversation, messages, onBack, onSendMessage }: MessageViewProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = useSelector((state: any) => state.auth.user?.id);
  const navigate = useNavigate();
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <Send className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  const handleProceed = async () => {
    const isProfileComplete = await checkProfileComplete(userId);
    if (isProfileComplete) {
      navigate(`/takeover/${conversation.listing.id}`);
    } else {
      // Handle incomplete profile case
      setIsWarningOpen(true);
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <CompleteProfile
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
      />
      <div className="p-4 border-b border-gray-200 bg-white shadow-sm flex items-center gap-3">
        <button
          onClick={onBack}
          className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br bg-[#7f5fba] flex items-center justify-center text-white font-semibold text-sm">
          {conversation.avatar || conversation.listing.title.substring(0, 2).toUpperCase()}
        </div>

        <div className="flex-1 flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-gray-900">{conversation.listing.title}</h2>
            <p className="text-xs text-gray-500">Active now</p>
          </div>
          {conversation.listing.userId !== userId && (
            <button
              className="bg-gradient-to-l mr-2 from-[#3182ed] to-[#56d28e] text-white px-2 py-1 text-sm rounded hover:scale-105 transition"
              onClick={handleProceed}
            >
              Proceed Now
            </button>
          )}

        </div>

      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender.id === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.sender.id === userId
                ? 'bg-[#7f5fba] text-white rounded-br-sm'
                : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'
                }`}
            >
              <p className="break-words">{message.content}</p>
              <p
                className={`text-xs mt-1 ${message.sender.id === userId ? 'text-blue-100' : 'text-gray-500'
                  }`}
              >
                {formatTime(message.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="px-6 py-3 bg-[#7f5fba] text-white rounded-full hover:bg-[#b99bf2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}