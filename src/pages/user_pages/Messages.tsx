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
  axios.defaults.withCredentials = true;

  const socketRef = useRef<Socket | null>(null);

  // --- Socket.IO setup ---
  useEffect(() => {
  const s = io("https://backend-takeover-4.onrender.com", {
  transports: ["websocket"] , 
  withCredentials: true, 
});
  socketRef.current = s;

  s.on("connect", () => {
    console.log("Connected to socket:", s.id);
  });

    // Listen for incoming messages
    s.on("receiveMessage", (message: Message) => {
    if (selectedConversation && message.conversationId === selectedConversation.id) {
      setMessages(prev => [...prev, message]);
    }
  });

     return () => {
    s.disconnect();
  };
}, []);

  // Join room whenever selectedConversation changes
 useEffect(() => {
  if (selectedConversation && socketRef.current) {
    socketRef.current.emit("joinRoom", selectedConversation.id);
  }
}, [selectedConversation]);


  // --- Fetch or create conversation from Lease Detail page ---
  useEffect(() => {
    if (hasRunRef.current || !listingId || !receiverId || !userId) return;
    hasRunRef.current = true;

    const fetchOrCreateConversation = async () => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/conversations/get-or-create`, {
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
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/conversations`, { id: userId });
      setConversations(res.data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: number) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/messages/${conversationId}`, { id: userId });
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

 const handleSendMessage = (content: string) => {
  if (!selectedConversation || !userId) return;
  if (!socketRef.current) {
    console.error("Socket not connected");
    return;
  }

  const messageData = {
    conversationId: selectedConversation.id,
    senderId: userId,
    content,
  };

  socketRef.current.emit("sendMessage", messageData);

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
