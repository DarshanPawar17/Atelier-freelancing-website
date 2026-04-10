import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import { GET_GIG_BY_ID_ROUTE, HOST, CHECK_USER_ORDERED_GIG_ROUTE, ACCEPT_TASK_ROUTE } from "../../utils/constants";
import { useStateProvider } from "../../context/StateContext";
import { FiClock, FiRepeat, FiCheck, FiStar, FiShoppingBag, FiArrowRight, FiShield, FiAlertCircle, FiX } from "react-icons/fi";
import { useCookies } from "react-cookie";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";

function TaskDetails() {
  const router = useRouter();
  const { gigId } = router.query;
  const [cookies] = useCookies();
  const [{ userInfo }] = useStateProvider();
  const [taskData, setTaskData] = useState(undefined);
  const [hasOrdered, setHasOrdered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const { data } = await axios.get(`${GET_GIG_BY_ID_ROUTE}/${gigId}`);
        setTaskData(data.gig);
      } catch (err) {
        console.error(err);
      }
    };
    if (gigId) fetchTaskData();
  }, [gigId]);

  useEffect(() => {
    const checkOrder = async () => {
      try {
        const { data } = await axios.get(`${CHECK_USER_ORDERED_GIG_ROUTE}/${gigId}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${cookies.jwt}` },
        });
        setHasOrdered(data.hasUserOrderedGig);
      } catch (err) {
        console.error(err);
      }
    };
    if (userInfo && gigId) checkOrder();
  }, [userInfo, gigId, cookies.jwt]);

  const handleAcceptAssignment = () => {
    if (!userInfo) {
      toast.error("Please sign in to accept this studio assignment.");
      return;
    }
    
    router.push(`/checkout?gigId=${gigId}`);
    setIsModalOpen(false);
  };

  const sidebarStatClass = "flex items-center gap-3 text-sm font-bold text-[#0f172a] opacity-80";

  return (
    <div className="min-h-screen bg-slate-50/50 pt-36 pb-24 px-6 md:px-16 lg:px-24">
      {taskData === undefined ? (
        <div className="flex flex-col items-center justify-center py-40 gap-6">
          <ThreeDots height="40" width="80" color="#6366f1" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Synchronizing Studio Brief...</span>
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
            
            {/* Main Task Content */}
            <div className="flex-1 space-y-12">
              
              {/* Task Header */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">
                  <FiShoppingBag /> Available Studio Assignment
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-[#0f172a] tracking-tighter leading-tight">
                  {taskData.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 pt-4">
                  <div className="flex items-center gap-3 text-sm font-bold border rounded-full px-6 py-2 bg-white">
                    <Image
                      src={taskData.createdBy?.profileImage ? (taskData.createdBy.profileImage.includes("http") ? taskData.createdBy.profileImage : `${HOST}/uploads/${taskData.createdBy.profileImage}`) : "/default_avatar.png"}
                      alt="Provider"
                      width={24}
                      height={24}
                      className="rounded-full overflow-hidden object-cover"
                    />
                    <span>{taskData.createdBy?.username}</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-500 font-bold">
                    <FiStar fill="currentColor" />
                    <span>{taskData.averageRating || "5.0"}</span>
                    <span className="text-slate-400 font-medium text-xs">({taskData.totalReviews || 0} Reviews)</span>
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                    {taskData.category}
                  </div>
                </div>
              </div>

              {/* Gallery Section */}
              <div className="studio-paper studio-ambient rounded-[3rem] studio-ghost-border bg-white p-4 overflow-hidden">
                <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden">
                  <Image
                    src={taskData.images?.[0] || "/placeholder_large.jpg"}
                    alt="Task Main Portfolio"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-8 left-8">
                    <span className="px-6 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-[#0f172a] shadow-xl">
                      Master Portfolio Item
                    </span>
                  </div>
                </div>
              </div>

              {/* Task Briefing */}
              <div className="space-y-6">
                <h2 className="text-3xl font-black text-[#0f172a] tracking-tight">Assignment Briefing</h2>
                <p className="text-slate-600 font-medium leading-[2] text-lg whitespace-pre-line">
                  {taskData.description}
                </p>
              </div>

              {/* Project Deliverables */}
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-[#0f172a] tracking-tight">Studio Deliverables</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {taskData.features?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-slate-50 shadow-sm studio-ambient hover:border-indigo-100 transition-all">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <FiCheck />
                      </div>
                      <span className="font-bold text-[#0f172a] text-sm tracking-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Pricing Sidebar */}
            <div className="w-full lg:w-[450px]">
              <div className="sticky top-40 space-y-6">
                
                <div className="studio-paper studio-ambient rounded-[3rem] studio-ghost-border bg-white p-10 space-y-10 group">
                  <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Fixed Assignment Fee</span>
                      <span className="text-5xl font-black text-[#0f172a] tracking-tighter transition-all group-hover:text-indigo-600">₹{taskData.price}</span>
                    </div>
                  </div>

                  <p className="text-slate-500 font-medium leading-relaxed italic border-l-2 border-indigo-100 pl-6">
                    {taskData.shortDesc}
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-indigo-500 mb-1">
                        <FiClock size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Delivery</span>
                      </div>
                      <span className="text-sm font-black text-[#0f172a]">{taskData.deliveryTime} Days</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-indigo-500 mb-1">
                        <FiRepeat size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Revisions</span>
                      </div>
                      <span className="text-sm font-black text-[#0f172a]">{taskData.revisions} Rounds</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={userInfo?.id === taskData.userId || taskData.isOrdered}
                    className="w-full bg-[#0f172a] text-white py-6 rounded-3xl text-sm font-black uppercase tracking-[0.3em] studio-ambient hover:bg-indigo-600 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {taskData.isOrdered ? "Task Commissioned" : userInfo?.id === taskData.userId ? "Your Own Brief" : "Accept Assignment"}
                    {!taskData.isOrdered && userInfo?.id !== taskData.userId && <FiArrowRight size={16} />}
                  </button>

                  <div className="flex items-center gap-3 justify-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <FiShield className="text-emerald-500" />
                    Transaction Secured by Atelier Logic
                  </div>
                </div>

                {/* Quick Profile Contact */}
                <div className="studio-paper studio-ambient rounded-[2.5rem] studio-ghost-border bg-white p-6 flex items-center justify-center">
                  <button
                    className="text-xs font-black uppercase tracking-widest text-[#0f172a] hover:text-indigo-600 transition-colors"
                  >
                    Discuss Assignment Specifications
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* Confirm Assignment Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0f172a]/40 backdrop-blur-md">
              <div className="studio-paper bg-white w-full max-w-lg rounded-[3rem] p-12 relative animate-in fade-in zoom-in duration-300">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-8 right-8 text-slate-400 hover:text-[#0f172a] transition-colors"
                >
                  <FiX size={24} />
                </button>
                
                <div className="text-center space-y-8">
                  <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto">
                    <FiAlertCircle size={40} />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-3xl font-black text-[#0f172a] tracking-tight">Confirm Assignment?</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                      You are about to commission <span className="text-[#0f172a] font-bold">"{taskData.title}"</span>. This will lock the task to your project board and initiate a direct message thread with the provider.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 pt-4">
                    <button
                      onClick={handleAcceptAssignment}
                      disabled={isAccepting}
                      className="w-full bg-[#0f172a] text-white py-6 rounded-3xl text-sm font-black uppercase tracking-[0.3em] studio-ambient hover:bg-indigo-600 transition-all flex items-center justify-center gap-3"
                    >
                      {isAccepting ? <ThreeDots height="20" width="40" color="white" /> : "Initiate Briefing"}
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                    >
                      Abandon Assignment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TaskDetails;
