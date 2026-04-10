import React, { useEffect, useState } from "react";
import { GET_SELLER_DATA_ROUTE } from "../../utils/constants";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { FiBox, FiPocket, FiCheckCircle, FiClock, FiPlus } from "react-icons/fi";

const SellerDashboard = () => {
  const [cookies] = useCookies();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const { data } = await axios.get(GET_SELLER_DATA_ROUTE, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        });
        setDashboardData(data.dashboardData);
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };
    if (cookies.jwt) getDashboardData();
  }, [cookies.jwt]);

  const statCardClass = "studio-paper studio-ambient rounded-[2.5rem] studio-ghost-border p-8 flex flex-col gap-4 bg-white hover:scale-[1.02] transition-transform duration-500 group";

  return (
    <div className="min-h-screen bg-slate-50/50 pt-36 pb-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500">Business Control</span>
            <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tighter">Task Management Dashboard</h1>
          </div>
          
          <button 
            onClick={() => router.push("/seller/gigs/create")}
            className="flex items-center gap-3 bg-[#0f172a] text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#6366f1] transition-all hover:scale-[1.02] active:scale-95 studio-ambient shadow-xl shadow-indigo-500/10"
          >
            <FiPlus size={16} />
            Post New Task
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          
          {/* Active Tasks */}
          <div className={statCardClass}>
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <FiBox size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-[#0f172a]">{dashboardData?.gigs || 0}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Published Tasks</span>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className={statCardClass}>
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 transition-colors">
              <FiClock size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-[#0f172a]">{dashboardData?.orders || 0}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Collaborations</span>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className={statCardClass}>
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 transition-colors">
              <FiCheckCircle size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-[#0f172a]">{dashboardData?.unreadMessages || 0}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Unread Briefs</span>
            </div>
          </div>

          {/* Total Earnings */}
          <div className={statCardClass}>
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white transition-colors">
              <FiPocket size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-[#0f172a]">₹{dashboardData?.dailyRevenue || 0}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Earnings</span>
            </div>
          </div>

        </div>

        {/* Informational Section */}
        <div className="studio-paper studio-ambient rounded-[3rem] studio-ghost-border bg-white p-12 md:p-16 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-black text-[#0f172a] tracking-tight">Expand Your Task Board</h2>
            <p className="text-slate-500 font-medium leading-relaxed max-w-xl">
              Creating more diverse tasks increases your visibility and commission potential. Start posting specialized offerings to attract more project clients.
            </p>
          </div>
          <button 
            onClick={() => router.push("/seller/gigs/create")}
            className="px-10 py-5 bg-indigo-50 text-indigo-600 rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all whitespace-nowrap"
          >
            Post a New Task
          </button>
        </div>

      </div>
    </div>
  );
};

export default SellerDashboard;
