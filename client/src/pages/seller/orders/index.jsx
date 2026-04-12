import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { FiMessageSquare, FiPackage, FiCalendar, FiDollarSign } from "react-icons/fi";
import { toast } from "react-toastify";
import { useStateProvider } from "../../../context/StateContext.jsx";
import { GET_SELLER_ORDERS, HOST } from "../../../utils/constants";

const SellerOrders = () => {
  const [cookies] = useCookies();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("ACTIVE");
  const [{ userInfo }] = useStateProvider();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const { data } = await axios.get(GET_SELLER_ORDERS, {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        });
        setOrders(data.orders);
      } catch (error) {
        console.error("Orders error:", error);
        toast.error("Failed to sync store logistics");
      }
    };

    if (userInfo) {
      getOrders();
    }
  }, [userInfo, cookies.jwt]);

  const tableHeaderClass = "px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100";
  const tableCellClass = "px-6 py-5 text-sm font-bold text-[#0f172a] border-b border-slate-50";

  return (
    <div className="min-h-screen bg-slate-50/50 pt-36 pb-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-12">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500">Logistics & Fullfillment</span>
            <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tighter">Your Commissions</h1>
          </div>
          
          <div className="flex items-center gap-4 border-b border-slate-200">
            <button
              onClick={() => setActiveTab("ACTIVE")}
              className={`pb-4 px-2 text-sm font-black uppercase tracking-widest transition-colors border-b-2 ${
                activeTab === "ACTIVE" ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Active Commissions
            </button>
            <button
              onClick={() => setActiveTab("COMPLETED")}
              className={`pb-4 px-2 text-sm font-black uppercase tracking-widest transition-colors border-b-2 ${
                activeTab === "COMPLETED" ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Project History
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="studio-paper studio-ambient rounded-[3rem] studio-ghost-border bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th scope="col" className={tableHeaderClass}>Project Details</th>
                  <th scope="col" className={tableHeaderClass}>Yield</th>
                  <th scope="col" className={tableHeaderClass}>Timeline</th>
                  <th scope="col" className={tableHeaderClass}>Client</th>
                  <th scope="col" className={tableHeaderClass}>Commencement</th>
                  <th scope="col" className={tableHeaderClass}><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {orders.filter(order => activeTab === "ACTIVE" ? order.status !== "COMPLETED" : order.status === "COMPLETED").length > 0 ? (
                  orders.filter(order => activeTab === "ACTIVE" ? order.status !== "COMPLETED" : order.status === "COMPLETED").map((order) => (
                    <tr key={order.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className={tableCellClass}>
                        <div className="flex flex-col">
                          <span className="group-hover:text-indigo-600 transition-colors">{order.gig.title}</span>
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{order.gig.category}</span>
                        </div>
                      </td>
                      <td className={tableCellClass}>
                        <div className="flex items-center gap-1.5 text-indigo-600">
                          <span className="font-black">₹</span>
                          <span className="text-lg font-black tracking-tighter">
                            {order.earnings || Math.round(order.price * 0.9)}
                          </span>
                        </div>
                      </td>
                      <td className={tableCellClass}>
                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">
                          {order.gig.deliveryTime} Days
                        </span>
                      </td>
                      <td className={tableCellClass}>
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-8 rounded-full border border-slate-100 overflow-hidden bg-slate-100 flex items-center justify-center">
                            {order.buyer.profileImage ? (
                              <Image
                                src={order.buyer.profileImage.includes("http") ? order.buyer.profileImage : `${HOST}/uploads/${order.buyer.profileImage}`}
                                alt={order.buyer.username}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-xs font-black text-[#0f172a]">
                                {order.buyer.email[0].toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span className="opacity-80 font-bold">{order.buyer.fullName}</span>
                        </div>
                      </td>
                      <td className={tableCellClass}>
                        <div className="flex items-center gap-2 text-slate-400">
                          <FiCalendar size={14} />
                          <span className="text-xs font-bold">{order.createdAt.split("T")[0]}</span>
                        </div>
                      </td>
                      <td className={`${tableCellClass} text-right`}>
                        <Link
                          href={`/seller/orders/messages/${order.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest"
                        >
                          <FiMessageSquare size={16} />
                          {activeTab === "ACTIVE" ? "Open Inquiry" : "View Record"}
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-32 text-center flex flex-col items-center justify-center">
                       <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                         <FiPackage size={24} />
                       </div>
                       <h3 className="text-xl font-black text-slate-400 mb-2">
                         {activeTab === "ACTIVE" ? "No Commissions Yet" : "No Completed Projects"}
                       </h3>
                       <p className="text-slate-400 font-medium text-sm">
                         {activeTab === "ACTIVE" ? "Active orders from your portfolio items will appear here." : "You have no projects in your delivery history."}
                       </p>
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

export default SellerOrders;
