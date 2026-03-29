import { useStateProvider } from "../../context/StateContext";
import { GET_UNREAD_MESSAGES, MARK_AS_READ_ROUTE } from "../../utils/constants";
import { useCookies } from "react-cookie";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiMail, FiCheckCircle, FiExternalLink, FiMessageSquare } from "react-icons/fi";

function UnreadMessages() {
  const [cookies] = useCookies();
  const [{ userInfo }] = useStateProvider();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUnreadMessages = async () => {
      try {
        const {
          data: { messages: unreadMessages },
        } = await axios.get(GET_UNREAD_MESSAGES, {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        });
        setMessages(unreadMessages);
      } catch (err) {
        console.error("Error fetching unread messages:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (userInfo) {
      getUnreadMessages();
    }
  }, [userInfo, cookies.jwt]);

  const markAsRead = async (id) => {
    try {
      const response = await axios.put(
        `${MARK_AS_READ_ROUTE}/${id}`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      }
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const tableHeaderClass = "px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100";
  const tableCellClass = "px-6 py-5 text-sm font-bold text-[#0f172a] border-b border-slate-50";

  return (
    <div className="min-h-screen bg-slate-50/50 pt-36 pb-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col gap-2 mb-12">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500">Inbound Intel</span>
          <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tighter">Communications Matrix</h1>
        </div>

        {/* Notifications Grid */}
        <div className="studio-paper studio-ambient rounded-[3rem] studio-ghost-border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th scope="col" className={tableHeaderClass}>Inquiry Content</th>
                  <th scope="col" className={tableHeaderClass}>Originator</th>
                  <th scope="col" className={tableHeaderClass}>Project Association</th>
                  <th scope="col" className={tableHeaderClass}><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <tr key={message.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className={tableCellClass}>
                        <div className="flex flex-col max-w-md">
                          <p className="line-clamp-1 group-hover:text-indigo-600 transition-colors">
                            {message?.text}
                          </p>
                          <span className="text-[10px] text-slate-400 font-medium">Previewing latent briefing</span>
                        </div>
                      </td>
                      <td className={tableCellClass}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-[#0f172a]">
                            {message?.sender?.fullName[0].toUpperCase()}
                          </div>
                          <span className="opacity-80 font-bold">{message?.sender?.fullName}</span>
                        </div>
                      </td>
                      <td className={tableCellClass}>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order</span>
                           <span className="font-black text-indigo-600">#{message.orderId.slice(-6).toUpperCase()}</span>
                        </div>
                      </td>
                      <td className={`${tableCellClass} text-right`}>
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => markAsRead(message.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-green-600 hover:bg-green-50 transition-all font-black text-[10px] uppercase tracking-widest"
                            title="Acknowledge Intel"
                          >
                            <FiCheckCircle size={14} />
                            Read
                          </button>
                          <Link
                            href={`/seller/orders/messages/${message.orderId}`}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest border border-indigo-100"
                          >
                            <FiExternalLink size={14} />
                            Enter Comms
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-32 text-center flex flex-col items-center justify-center">
                       <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                         <FiMail size={24} />
                       </div>
                       <h3 className="text-xl font-black text-slate-400 mb-2">Comms Zeroed</h3>
                       <p className="text-slate-400 font-medium text-sm">All incoming briefings have been acknowledged and processed.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnreadMessages;
