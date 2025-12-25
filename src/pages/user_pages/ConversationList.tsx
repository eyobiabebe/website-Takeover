import { MessageCircle } from 'lucide-react';
import { useSelector } from 'react-redux';

type Conversation = {
  id: number;
  listing: { id: number; title: string };
  avatar: string;
  participant1: { id: string; name: string };
  participant2: { id: string; name: string };
  created_at: string;
  lastMessage?: string; // Add this
  lastMessageTime?: string; // Add this
};

type ConversationListProps = {
  conversations: Conversation[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export default function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  const userId = useSelector((state: any) => state.auth.user?.id);
  
  // Format time function
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      
      // If less than 24 hours, show time
      if (diffHours < 24) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } 
      // If less than 7 days, show day
      else if (diffHours < 168) {
        return date.toLocaleDateString([], { weekday: 'short' });
      } 
      // Otherwise show date
      else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    } catch (error) {
      return '';
    }
  };

  // Get other user name
  const getOtherUserName = (conversation: Conversation) => {
    return conversation.participant1.id === userId
      ? conversation.participant2.name
      : conversation.participant1.name;
  };

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
          conversations.map((conversation) => {
            const otherUserName = getOtherUserName(conversation);
            
            return (
              <button
                key={conversation.id}
                onClick={() => onSelect(conversation.id)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  selectedId === conversation.id ? 'bg-blue-50 hover:bg-blue-50' : ''
                }`}
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7f5fba] to-[#8d5aed] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {otherUserName.substring(0, 2).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  {/* First row: Listing title and time */}
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {conversation.listing.title}
                    </h3>
                    {conversation.lastMessageTime && (
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    )}
                  </div>
                  
                  {/* Second row: Other user's name */}
                  <p className="text-sm text-gray-600 truncate mb-1">
                    {otherUserName}
                  </p>
                  
                  {/* Third row: Last message preview */}
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage ? (
                      <span className="flex items-center">
                        {conversation.lastMessage.length > 40 
                          ? `${conversation.lastMessage.substring(0, 40)}...`
                          : conversation.lastMessage
                        }
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">
                        No messages yet
                      </span>
                    )}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}