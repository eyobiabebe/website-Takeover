import { MessageCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
// import type { Conversation } from '../lib/supabase';

type Conversation = {
  id: number;
  // name: string;
  listing: { id: number; title: string };
  avatar: string;
  participant1: { id: string; name: string };
  participant2: { id: string; name: string };
  // last_message: string;
  // last_message_time: string;
  created_at: string;
};

type ConversationListProps = {
  conversations: Conversation[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  const userId = useSelector((state: any) => state.auth.user?.id);
  
  

  return (
    <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#7f5fba] to-[#8d5aed]">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-7 h-7" />
          Messages
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No conversations yet</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                selectedId === conversation.id ? 'bg-blue-50 hover:bg-blue-50' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br bg-[#7f5fba] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {conversation.avatar || conversation.listing.title.substring(0, 2).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {conversation.listing.title}
                  </h3>
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {/* {formatTime(conversation.last_message_time)} */}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {/* {conversation.last_message}
                  {" "} */}
                  {conversation.participant1.id === userId
                    ? conversation.participant2.name
                    : conversation.participant1.name}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
