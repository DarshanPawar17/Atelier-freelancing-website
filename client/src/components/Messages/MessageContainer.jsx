import { useRouter } from "next/router";
import axios from "axios";
import { useCookies } from "react-cookie";
import { FiSend, FiCheck, FiMoreVertical } from "react-icons/fi";
import { useStateProvider } from "../../context/StateContext";
import { useEffect, useState, useRef } from "react";
import { GET_MESSAGES, SEND_MESSAGE } from "../../utils/constants";
import { ThreeDots } from "react-loader-spinner";

const MessageContainer = () => {
  const [cookies] = useCookies();
  const router = useRouter();
  const { orderId } = router.query;
  const [{ userInfo }] = useStateProvider();
  const [receiverId, setReceiverId] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [isLoading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${GET_MESSAGES}/${orderId}`, {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        });
        setMessages(data.messages);
        setReceiverId(data.receiverId);
        setLoading(false);
      } catch (err) {
        console.error("Messaging error:", err);
        setLoading(false);
      }
    };

    if (orderId && userInfo) {
      getMessages();
      // Implementation of basic polling for real-time feel (every 5s)
      const interval = setInterval(async () => {
         try {
           const { data } = await axios.get(`${GET_MESSAGES}/${orderId}`, {
             headers: { Authorization: `Bearer ${cookies.jwt}` },
           });
           setMessages(data.messages);
         } catch(e) {}
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [orderId, userInfo, cookies.jwt]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function formatTime(timestamp) {
    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours %= 12;
    hours = hours || 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  }

  const sendMessage = async () => {
    if (messageText.trim().length) {
      try {
        const response = await axios.post(
          `${SEND_MESSAGE}/${orderId}`,
          {
            message: messageText,
            receiverId,
          },
          {
            headers: {
              Authorization: `Bearer ${cookies.jwt}`,
            },
          }
        );
        if (response.status === 201) {
          setMessages([...messages, response.data.message]);
          setMessageText("");
        }
      } catch (err) {
        console.error("Send error:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-36 pb-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <div className="studio-paper studio-ambient rounded-[3rem] studio-ghost-border bg-white overflow-hidden flex flex-col h-[70vh]">
          
          {/* Channel Header */}
          <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black">
                SB
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-widest">Studio Briefing</h3>
                <span className="text-[10px] font-bold text-slate-400">Order ID: {orderId?.slice(-8).toUpperCase()}</span>
              </div>
            </div>
            <button className="text-slate-300 hover:text-[#0f172a] transition-colors">
              <FiMoreVertical size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
            {isLoading && messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <ThreeDots height="40" width="40" color="#6366f1" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Comms</span>
              </div>
            ) : (
              messages.map((message) => {
                const isOwner = message.senderId === userInfo.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwner ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex flex-col max-w-[70%] gap-2 ${isOwner ? "items-end" : "items-start"}`}>
                      <div
                        className={`px-6 py-4 rounded-[2rem] text-sm font-medium shadow-sm transition-all ${
                          isOwner
                            ? "bg-[#0f172a] text-white rounded-tr-none"
                            : "bg-slate-100 text-slate-700 rounded-tl-none"
                        }`}
                      >
                        <p className="leading-relaxed">{message.text}</p>
                      </div>
                      <div className="flex items-center gap-2 px-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-300">
                          {formatTime(message.createdAt)}
                        </span>
                        {isOwner && (
                          <FiCheck className={`${message.isRead ? "text-indigo-500" : "text-slate-200"}`} size={14} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-8 border-t border-slate-50 bg-slate-50/30">
            <div className="relative flex items-center gap-4">
              <input
                type="text"
                className="flex-1 bg-white studio-ghost-border rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder:text-slate-300"
                placeholder="Compose briefing..."
                onChange={(e) => setMessageText(e.target.value)}
                value={messageText}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                disabled={!messageText.trim()}
                className="w-14 h-14 bg-[#0f172a] text-white rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all disabled:opacity-20 disabled:scale-100"
              >
                <FiSend size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageContainer;
