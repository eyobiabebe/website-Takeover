import { useState, useEffect, useRef } from "react";
import ConversationList from "./ConversationList";
import MessageView from "./MessageView";
import { useSelector } from "react-redux";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

type Conversation = {
  id: number;
  listing: { id: number; title: string; userId: number };
  avatar: string;
  participant1: { id: string; name: string };
  participant2: { id: string; name: string };
  created_at: string;
  lastMessage?: string;
  lastMessageTime?: string;
};

type Message = {
  id: number;
  content: string;
  sender: { id: string; name: string };
  createdAt: string;
  conversationId?: number;
};

let socket: Socket;

function Messages() {
  const [searchParams] = useSearchParams();
  const hasRunRef = useRef(false);
  const listingId = searchParams.get("listingId");
  const receiverId = searchParams.get("receiverId");

  const userId = useSelector((state: any) => state.auth.user?.id);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ---------------- SOCKET SETUP ---------------- */
  useEffect(() => {
    socket = io("https://backend-takeover-4.onrender.com",{
   transports: ["websocket"] , 
   withCredentials: true, 
    auth: {
    token: localStorage.getItem("authToken"), // fallback only
  },
});

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("receiveMessage", (message: Message) => {
      // 1️⃣ Add message to message view if open
      if (
        selectedConversation &&
        message.conversationId === selectedConversation.id
      ) {
        setMessages((prev) => [...prev, message]);
      }

      // 2️⃣ Update conversation list (last message + time)
      setConversations((prev) => {
        const updated = prev.map((conv) =>
          conv.id === message.conversationId
            ? {
                ...conv,
                lastMessage: message.content,
                lastMessageTime: message.createdAt,
              }
            : conv
        );

        // 3️⃣ Move updated conversation to top
        return updated.sort(
          (a, b) =>
            new Date(b.lastMessageTime || 0).getTime() -
            new Date(a.lastMessageTime || 0).getTime()
        );
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedConversation]);

  /* ---------------- JOIN ROOM ---------------- */
  useEffect(() => {
    if (selectedConversation) {
      socket.emit("joinRoom", selectedConversation.id);
    }
  }, [selectedConversation]);

  /* ---------------- CREATE OR GET CONVERSATION ---------------- */
  useEffect(() => {
    if (hasRunRef.current || !listingId || !receiverId || !userId) return;
    hasRunRef.current = true;

    const fetchConversation = async () => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/conversations/get-or-create`, {
          listingId: Number(listingId),
          senderId: userId,
          receiverId,
        },{ 
          withCredentials: true ,
         headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      });

        setConversations((prev) => [res.data, ...prev]);
        setSelectedConversation(res.data);
        setShowMessages(true);
      } catch (err) {
        console.error(err);
      }
    };

    fetchConversation();
  }, [listingId, receiverId, userId]);

  /* ---------------- LOAD CONVERSATIONS ---------------- */
  const loadConversations = async () => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/conversations`,{ id: userId },{ 
          withCredentials: true ,
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      } );

    // For each conversation, fetch last message
    const conversationsWithLastMessage = await Promise.all(
      res.data.map(async (conv: Conversation) => {
        try {
          const msgRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/messages/${conv.id}`,{ id: userId},{ 
          withCredentials: true ,
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      } );

          const messages = msgRes.data.messages || [];
          const lastMsg = messages[messages.length - 1];

          return {
            ...conv,
            lastMessage: lastMsg?.content,
            lastMessageTime: lastMsg?.createdAt,
          };
        } catch {
          return conv;
        }
      })
    );

    setConversations(
      conversationsWithLastMessage.sort(
        (a, b) =>
          new Date(b.lastMessageTime || 0).getTime() -
          new Date(a.lastMessageTime || 0).getTime()
      )
    );
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    loadConversations();
  }, []);

  /* ---------------- LOAD MESSAGES ---------------- */
  const loadMessages = async (conversationId: number) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/messages/${conversationId}`,{id: userId},{ 
          withCredentials: true ,
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      });
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  /* ---------------- SEND MESSAGE ---------------- */
  const handleSendMessage = (content: string) => {
    if (!selectedConversation || !userId) return;

    const payload = {
      conversationId: selectedConversation.id,
      senderId: userId,
      content,
    };

    socket.emit("sendMessage", payload);

    // Optimistic UI
    const now = new Date().toISOString();

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        content,
        sender: { id: userId, name: "" },
        createdAt: now,
        conversationId: selectedConversation.id,
      },
    ]);

    // Update conversation list instantly
    setConversations((prev) =>
      prev
        .map((conv) =>
          conv.id === selectedConversation.id
            ? {
                ...conv,
                lastMessage: content,
                lastMessageTime: now,
              }
            : conv
        )
        .sort(
          (a, b) =>
            new Date(b.lastMessageTime || 0).getTime() -
            new Date(a.lastMessageTime || 0).getTime()
        )
    );
  };

  const handleSelectConversation = (id: number) => {
    const conv = conversations.find((c) => c.id === id) || null;
    setSelectedConversation(conv);
    setShowMessages(true);
  };

  const handleBack = () => setShowMessages(false);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex pt-16">
      <div className={`${showMessages ? "hidden md:flex" : "flex"} w-full md:w-auto`}>
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversation?.id || null}
          onSelect={handleSelectConversation}
        />
      </div>

      <div className={`${showMessages ? "flex" : "hidden md:flex"} flex-1`}>
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
