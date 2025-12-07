// export default Messages;
import { useState, useEffect, useRef } from 'react';
import ConversationList from './ConversationList';
import MessageView from './MessageView';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

type Conversation = {
  id: number;
  listing: { id: number; title: string; userId: number };
  avatar: string;
  participant1: { id: string; name: string };
  participant2: { id: string; name: string };
  created_at: string;
};

type Message = {
  id: number;
  content: string;
  sender: { id: string; name: string };
  createdAt: string;
  conversationId?: number; // needed for socket receiveMessage
};

let socket: Socket;

function Messages() {
  const [searchParams] = useSearchParams();
  const hasRunRef = useRef(false);
  const listingId = searchParams.get("listingId");
  const receiverId = searchParams.get("receiverId");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMessages, setShowMessages] = useState(false);
  const userId = useSelector((state: any) => state.auth.user?.id);

  // --- Socket.IO setup ---
  useEffect(() => {
    socket = io("http://localhost:3000"); // your backend socket server
    socket.on("connect", () => {
      console.log("Connected to socket server:", socket.id);
    });

    // Listen for incoming messages
    socket.on("receiveMessage", (message: Message) => {
      if (selectedConversation && message.conversationId === selectedConversation.id) {
        setMessages(prev => [...prev, message]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedConversation]);

  // Join room whenever selectedConversation changes
  useEffect(() => {
    if (selectedConversation) {
      socket.emit("joinRoom", selectedConversation.id);
    }
  }, [selectedConversation]);

  // --- Fetch or create conversation from Lease Detail page ---
  useEffect(() => {
    if (hasRunRef.current || !listingId || !receiverId || !userId) return;
    hasRunRef.current = true;

    const fetchOrCreateConversation = async () => {
      try {
        const res = await axios.post("/api/conversations/get-or-create", {
          listingId: Number(listingId),
          senderId: userId,
          receiverId,
        });
        setConversations(prev => [...prev, res.data]);
        setSelectedConversation(res.data);
        setShowMessages(true);
      } catch (err) {
        console.error("Failed to create or get conversation", err);
      }
    };

    fetchOrCreateConversation();
  }, [listingId, receiverId, userId]);

  // Load conversations
  useEffect(() => {
    loadConversations();
  }, []);

  // Load messages when selectedConversation changes
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      const res = await axios.post("/api/conversations", { id: userId });
      setConversations(res.data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: number) => {
    try {
      const res = await axios.post(`/api/messages/${conversationId}`, { id: userId });
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSelectConversation = (id: number) => {
    const conversation = conversations.find(c => c.id === id);
    setSelectedConversation(conversation || null);
    setShowMessages(true);
  };

  const handleBack = () => setShowMessages(false);

  // --- Send message via Socket.IO ---
  const handleSendMessage = (content: string) => {
    if (!selectedConversation || !userId) return;

    const messageData = {
      conversationId: selectedConversation.id,
      senderId: userId,
      content,
    };

    socket.emit("sendMessage", messageData);

    // Optimistic update
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        content,
        sender: { id: userId, name: "" },
        createdAt: new Date().toISOString(),
        conversationId: selectedConversation.id,
      }
    ]);

    // Optionally refresh conversations list
    loadConversations();
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-100 flex pt-16">
      <div className={`${showMessages ? 'hidden md:flex' : 'flex'} w-full md:w-auto`}>
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversation?.id || null}
          onSelect={handleSelectConversation}
        />
      </div>

      <div className={`${showMessages ? 'flex' : 'hidden md:flex'} flex-1`}>
        <MessageView
          conversation={selectedConversation}
          messages={messages}
          onBack={handleBack}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

export default Messages;
