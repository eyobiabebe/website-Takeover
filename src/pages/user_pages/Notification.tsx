// src/components/Notification.tsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { X, Check, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";

interface NotificationType {
  id: number;
  userId: string;
  type: "takeover_applied" | "takeover_accepted" | "takeover_rejected" | "listing_created";
  title: string;
  message: string;
  data?: { [key: string]: any };
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

const NotificationSidebar: React.FC<Props> = ({ open, onClose }) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const userId = useSelector((state: any) => state.auth.user?.id);
  const socketRef = useRef<Socket | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notifications/${userId}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/notifications/read/${id}`);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`/api/notifications/${userId}/read-all`);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  useEffect(() => {
    if (!userId) return;

    fetchNotifications();

    const socket = io("https://backend-takeover-4.onrender.com");
    socketRef.current = socket;

    socket.emit("register", userId);

    socket.on("notification", (notif: NotificationType) => {
      setNotifications(prev => [notif, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  // close sidebar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="fixed right-0 top-0 h-full w-full max-w-sm md:w-96 bg-white shadow-lg border-l border-gray-200 overflow-y-auto z-50 p-4"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Notifications</h2>
        <div className="flex space-x-2">
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm px-2 py-1 rounded bg-[#7f5fba] text-white hover:bg-blue-600"
            >
              Mark All Read
            </button>
          )}
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        notifications.map(n => (
          <div
            key={n.id}
            className={`p-3 mb-2 rounded border relative ${
              n.isRead ? "border-gray-200 bg-gray-50" : "border-[#a889e0] bg-blue-50"
            }`}
          >
            <div className="absolute top-2 right-2 flex space-x-2">
              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="text-green-600 hover:text-green-800"
                  title="Mark as Read"
                >
                  <Check size={16} />
                </button>
              )}
              <button
                onClick={() => deleteNotification(n.id)}
                className="text-red-600 hover:text-red-800"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <p className="font-semibold text-sm">{n.title}</p>
            <p className="text-sm text-gray-700">{n.message}</p>
            {n.data?.listingId && (
              <p className="text-xs text-gray-500 mt-1">
                Listing ID: {n.data.listingId}
              </p>
            )}
            <p className="text-[10px] text-gray-400 mt-1">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationSidebar;
