import { useRouter } from "next/router";
import axios from "axios";
import { useCookies } from "react-cookie";
import { FiSend, FiCheck, FiMoreVertical, FiLayout, FiCheckCircle, FiClock, FiFileText, FiShield } from "react-icons/fi";
import { useStateProvider } from "../../context/StateContext";
import { useEffect, useState, useRef } from "react";
import { GET_MESSAGES, SEND_MESSAGE, DELIVER_ORDER_ROUTE, COMPLETE_ORDER_ROUTE } from "../../utils/constants";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";

const MessageContainer = () => {
  const [cookies] = useCookies();
  const router = useRouter();
  const { orderId } = router.query;
  const [{ userInfo }] = useStateProvider();
  const [receiverId, setReceiverId] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [order, setOrder] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isActionLoading, setActionLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getMessages = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const { data } = await axios.get(`${GET_MESSAGES}/${orderId}`, {
        headers: {
          Authorization: `Bearer ${cookies.jwt}`,
        },
      });
      setMessages(data.messages);
      setReceiverId(data.receiverId);
      setOrder(data.order);
      setLoading(false);
    } catch (err) {
      console.error("Messaging error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId && userInfo) {
      getMessages();
      const interval = setInterval(() => getMessages(false), 5000);
      return () => clearInterval(interval);
    }
  }, [orderId, userInfo, cookies.jwt]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleDeliver = async () => {
    const note = prompt("Enter a brief delivery note for the client:");
    if (!note) return;

    try {
      setActionLoading(true);
      await axios.post(DELIVER_ORDER_ROUTE, 
        { orderId, deliveryNote: note },
        { headers: { Authorization: `Bearer ${cookies.jwt}` } }
      );
      toast.success("Project delivered successfully!");
      getMessages();
    } catch (err) {
      toast.error("Failed to deliver project.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!confirm("Are you satisfied with the deliverables? This will officially close the portfolio assignment.")) return;

    try {
      setActionLoading(true);
      await axios.post(COMPLETE_ORDER_ROUTE, 
        { orderId },
        { headers: { Authorization: `Bearer ${cookies.jwt}` } }
      );
      toast.success("Project officially closed!");
      getMessages();
    } catch (err) {
      toast.error("Failed to complete project.");
    } finally {
      setActionLoading(false);
    }
  };

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

  const isSeller = order && userInfo && order.gig?.userId === userInfo.id;

  return (
    <div className="min-h-screen bg-slate-50/50 pt-36 pb-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 h-[75vh]">
          
          {/* Main Chat Area */}
          <div className="flex-1 studio-paper studio-ambient rounded-[3rem] studio-ghost-border bg-white overflow-hidden flex flex-col">
            {/* Channel Header */}
            <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black">
                  {isSeller ? "CL" : "SP"}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-widest">
                    {isSeller ? "Client Communication" : "Specialist Briefing"}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400">Order Session: {orderId?.slice(-8).toUpperCase()}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                  order?.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600" :
                  order?.status === "DELIVERED" ? "bg-amber-50 text-amber-600" :
                  "bg-indigo-50 text-indigo-600"
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    order?.status === "COMPLETED" ? "bg-emerald-500" :
                    order?.status === "DELIVERED" ? "bg-amber-500" :
                    "bg-indigo-500"
                  }`} />
                  {order?.status?.replace("_", " ")}
                </div>
                <button className="text-slate-300 hover:text-[#0f172a] transition-colors">
                  <FiMoreVertical size={20} />
                </button>
              </div>
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
                  const isOwner = message.senderId === userInfo?.id;
                  const isSystem = message.text.startsWith("SYSTEM ARCHITECT:");
                  
                  if (isSystem) {
                    return (
                      <div key={message.id} className="flex justify-center py-4">
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3 flex items-center gap-3">
                          <FiShield className="text-indigo-500" size={14} />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{message.text}</span>
                        </div>
                      </div>
                    );
                  }

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
            <div className={`p-8 border-t border-slate-50 bg-slate-50/30 ${order?.status === "COMPLETED" ? "opacity-50 pointer-events-none" : ""}`}>
              <div className="relative flex items-center gap-4">
                <input
                  type="text"
                  className="flex-1 bg-white studio-ghost-border rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all placeholder:text-slate-300"
                  placeholder={order?.status === "COMPLETED" ? "Session closed" : "Compose briefing..."}
                  onChange={(e) => setMessageText(e.target.value)}
                  value={messageText}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageText.trim() || order?.status === "COMPLETED"}
                  className="w-14 h-14 bg-[#0f172a] text-white rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all disabled:opacity-20 disabled:scale-100"
                >
                  <FiSend size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Project Management Sidebar */}
          <div className="w-full lg:w-96 flex flex-col gap-6">
            <div className="studio-paper studio-ambient rounded-[3rem] studio-ghost-border bg-white p-10 flex flex-col gap-8 flex-1 overflow-y-auto">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 mb-2 block">Project Briefing</span>
                <h2 className="text-2xl font-black text-[#0f172a] tracking-tighter leading-tight">
                  {order?.gig?.title || "Loading Project..."}
                </h2>
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-400">
                    <FiClock size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">Timeline</span>
                  </div>
                  <span className="text-sm font-black text-[#0f172a]">{order?.gig?.deliveryTime} Days</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-400">
                    <FiLayout size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">Revision Credits</span>
                  </div>
                  <span className="text-sm font-black text-[#0f172a]">{order?.gig?.revisions} Available</span>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Core Deliverables</span>
                <div className="space-y-3">
                  {order?.gig?.features?.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 group">
                      <div className="mt-1 w-4 h-4 rounded-full border-2 border-indigo-100 flex items-center justify-center group-hover:border-indigo-500 transition-colors">
                        <FiCheck size={10} className="text-indigo-500 opacity-0 group-hover:opacity-100" />
                      </div>
                      <span className="text-xs font-bold text-slate-600 group-hover:text-[#0f172a] transition-colors">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {order?.deliveryNote && (
                <div className="bg-amber-50 rounded-[2rem] p-6 border border-amber-100">
                  <div className="flex items-center gap-2 mb-3 text-amber-700">
                    <FiFileText size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Specialist Handover Note</span>
                  </div>
                  <p className="text-xs font-medium text-amber-800 leading-relaxed italic">"{order.deliveryNote}"</p>
                </div>
              )}

              <div className="mt-auto pt-8 border-t border-slate-50">
                {isSeller ? (
                  <button
                    onClick={handleDeliver}
                    disabled={order?.status !== "IN_PROGRESS" || isActionLoading}
                    className="w-full py-5 bg-[#0f172a] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:bg-slate-200 disabled:text-slate-400 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isActionLoading ? <ThreeDots height="20" width="40" color="white" /> : (
                      <>
                        <FiCheckCircle size={18} />
                        Deliver Final Work
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleComplete}
                    disabled={order?.status !== "DELIVERED" || isActionLoading}
                    className="w-full py-5 bg-emerald-500 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:bg-slate-200 disabled:text-slate-400 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isActionLoading ? <ThreeDots height="20" width="40" color="white" /> : (
                      <>
                        <FiCheckCircle size={18} />
                        Approve & Close Project
                      </>
                    )}
                  </button>
                )}
                <p className="text-[10px] font-medium text-slate-400 text-center mt-4 px-4 leading-relaxed">
                  {isSeller 
                    ? "Submitting final work will notify the client for approval and portfolio lock."
                    : "Approving completion finalized the transaction and closes this briefing room."}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MessageContainer;

