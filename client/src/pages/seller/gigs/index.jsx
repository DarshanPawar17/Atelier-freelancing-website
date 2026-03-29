import React, { useEffect, useState } from "react";
import { GET_ALL_USER_GIGS_ROUTE } from "../../../utils/constants";
import axios from "axios";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { FiEdit2, FiPlus, FiBox, FiCheckCircle, FiActivity } from "react-icons/fi";

const SellerTasks = () => {
  const [cookies] = useCookies();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getUserTasks = async () => {
      try {
        const { data } = await axios.get(GET_ALL_USER_GIGS_ROUTE, {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        });
        setTasks(data.gigs);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    getUserTasks();
  }, [cookies.jwt]);

  const tableHeaderClass = "px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100";
  const tableCellClass = "px-6 py-5 text-sm font-bold text-[#0f172a] border-b border-slate-50";

  return (
    <div className="min-h-screen bg-slate-50/50 pt-36 pb-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500">Service Management</span>
            <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tighter">My Task Board</h1>
          </div>
          
          <Link 
            href="/seller/gigs/create" 
            className="flex items-center gap-3 bg-[#0f172a] text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#6366f1] transition-all hover:scale-[1.02] active:scale-95 studio-ambient shadow-lg shadow-indigo-500/10"
          >
            <FiPlus size={16} />
            Post a New Task
          </Link>
        </div>

        {/* Tasks Table */}
        <div className="studio-paper studio-ambient rounded-[3rem] studio-ghost-border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th scope="col" className={tableHeaderClass}>Task Title</th>
                  <th scope="col" className={tableHeaderClass}>Category</th>
                  <th scope="col" className={tableHeaderClass}>Delivery</th>
                  <th scope="col" className={tableHeaderClass}>Price</th>
                  <th scope="col" className={tableHeaderClass}>Availability</th>
                  <th scope="col" className={tableHeaderClass}><span className="sr-only">Edit</span></th>
                </tr>
              </thead>
              <tbody>
                {tasks.length > 0 ? (
                  tasks.map(({ title, category, deliveryTime, price, id, isOrdered }) => (
                    <tr key={id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className={tableCellClass}>
                        <div className="flex flex-col">
                          <span className="group-hover:text-indigo-600 transition-colors">{title}</span>
                          <span className="text-[10px] text-slate-400 font-medium">TASK ID: {id.slice(-8).toUpperCase()}</span>
                        </div>
                      </td>
                      <td className={tableCellClass}>
                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#0f172a]">
                          {category}
                        </span>
                      </td>
                      <td className={tableCellClass}>
                        <div className="flex items-center gap-2">
                          <span className="opacity-60">{deliveryTime}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Days</span>
                        </div>
                      </td>
                      <td className={tableCellClass}>
                        <span className="text-lg font-black text-[#0f172a]">${price}</span>
                      </td>
                      <td className={tableCellClass}>
                        {isOrdered ? (
                          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100 w-fit">
                            <FiCheckCircle className="text-emerald-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Commissioned</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-2xl border border-indigo-100 w-fit">
                            <FiActivity className="text-indigo-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Available</span>
                          </div>
                        )}
                      </td>
                      <td className={`${tableCellClass} text-right`}>
                        <Link
                          href={`/seller/gigs/${id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest"
                        >
                          <FiEdit2 size={14} />
                          Edit Task
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-32 text-center bg-white">
                       <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6 font-black">
                            <FiBox size={24} />
                          </div>
                          <h3 className="text-xl font-black text-slate-400 mb-2">No Active Tasks Found</h3>
                          <p className="text-slate-400 font-medium text-sm">Expand your reach by posting your first task today.</p>
                       </div>
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
};

export default SellerTasks;
