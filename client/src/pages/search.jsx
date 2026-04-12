import SearchGridItem from "../components/search/SearchGridItem";
import { SEARCH_GIGS_ROUTE } from "../utils/constants";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FiSearch, FiFilter, FiZap, FiCheck } from "react-icons/fi";
import { ThreeDots } from "react-loader-spinner";
import { motion, AnimatePresence } from "framer-motion";
import { categories as defaultCategories } from "../utils/categories";

function Search() {
  const router = useRouter();
  const { q, category } = router.query;
  const [tasks, setTasks] = useState(undefined);
  const [filteredTasks, setFilteredTasks] = useState(undefined);

  // Filter State
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    deliveryTime: "Any",
    selectedCategories: [],
  });

  const deliveryOptions = [
    { label: "Any Delivery Time", value: "Any" },
    { label: "Express (24 Hours)", value: "1" },
    { label: "Up to 3 Days", value: "3" },
    { label: "Up to 7 Days", value: "7" },
  ];

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(
          `${SEARCH_GIGS_ROUTE}?searchTerm=${q || "all"}&category=${category || ""}`
        );
        const fetchedGigs = data.gigs || [];
        setTasks(fetchedGigs);
        
        // If a category was passed in the URL, initialize the filter with it
        if (category && category !== "all") {
          setFilters(prev => ({ ...prev, selectedCategories: [category] }));
        }
      } catch (err) {
        console.error(err);
        setTasks([]);
      }
    };
    if (router.isReady) {
      getData();
    }
  }, [q, category, router.isReady]);

  // Real-time pure filtering engine
  useEffect(() => {
    if (tasks) {
      const filtered = tasks.filter((task) => {
        // Price Filter
        if (filters.minPrice && task.price < Number(filters.minPrice)) return false;
        if (filters.maxPrice && task.price > Number(filters.maxPrice)) return false;

        // Delivery Filter
        if (filters.deliveryTime !== "Any") {
          if (task.deliveryTime > Number(filters.deliveryTime)) return false;
        }

        // Category Filter
        if (filters.selectedCategories.length > 0) {
          if (!filters.selectedCategories.includes(task.category)) return false;
        }

        return true;
      });
      setFilteredTasks(filtered);
    }
  }, [tasks, filters]);

  const toggleCategory = (catName) => {
    setFilters(prev => {
      const isSelected = prev.selectedCategories.includes(catName);
      if (isSelected) {
        return { ...prev, selectedCategories: prev.selectedCategories.filter(c => c !== catName) };
      } else {
        return { ...prev, selectedCategories: [...prev.selectedCategories, catName] };
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      deliveryTime: "Any",
      selectedCategories: [],
    });
  };

  const activeFilterCount = (filters.minPrice ? 1 : 0) + (filters.maxPrice ? 1 : 0) + (filters.deliveryTime !== "Any" ? 1 : 0) + filters.selectedCategories.length;

  return (
    <div className="min-h-screen bg-slate-50/50 pt-36 pb-24 px-6 md:px-10 lg:px-16">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Search Results Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-indigo-500">
              <FiZap className="animate-pulse" />
              Discovery Results
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-[#0f172a] tracking-tighter leading-tight">
              {q ? (
                <>Tasks matching <span className="text-indigo-600">"{q}"</span></>
              ) : category ? (
                <>Top <span className="text-indigo-600">{category}</span> Tasks</>
              ) : (
                "Explore Available Tasks"
              )}
            </h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Sidebar - Filters */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="sticky top-32 space-y-6">
              <div className="studio-paper studio-ambient rounded-[2rem] studio-ghost-border bg-white p-8">
                <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
                  <h3 className="text-xl font-black text-[#0f172a] flex items-center gap-2">
                    <FiFilter className="text-indigo-600" /> Filters
                    {activeFilterCount > 0 && (
                      <span className="bg-indigo-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full ml-1">
                        {activeFilterCount}
                      </span>
                    )}
                  </h3>
                  {activeFilterCount > 0 && (
                    <button 
                      onClick={clearFilters}
                      className="text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Price Range Filter */}
                <div className="mb-8">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#0f172a] mb-4">Budget Range (₹)</h4>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 border-none focus:ring-indigo-100 transition-all placeholder:font-medium"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    />
                    <span className="text-slate-300 font-bold">-</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 border-none focus:ring-indigo-100 transition-all placeholder:font-medium"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    />
                  </div>
                </div>

                {/* Delivery Time Filter */}
                <div className="mb-8">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#0f172a] mb-4">Delivery Time</h4>
                  <div className="space-y-3 relative z-10">
                    {deliveryOptions.map((option) => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${filters.deliveryTime === option.value ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200 group-hover:border-indigo-400'}`}>
                          {filters.deliveryTime === option.value && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <input 
                          type="radio" 
                          name="deliveryTime" 
                          value={option.value} 
                          className="hidden"
                          checked={filters.deliveryTime === option.value}
                          onChange={(e) => setFilters({...filters, deliveryTime: e.target.value})}
                        />
                        <span className={`text-sm font-semibold transition-colors ${filters.deliveryTime === option.value ? 'text-[#0f172a]' : 'text-slate-500 group-hover:text-[#0f172a]'}`}>
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories Filter */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#0f172a] mb-4">Specialties</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {defaultCategories.map((cat) => {
                      const isSelected = filters.selectedCategories.includes(cat.name);
                      return (
                        <div 
                          key={cat.name} 
                          className="flex items-center gap-3 cursor-pointer group"
                          onClick={() => toggleCategory(cat.name)}
                        >
                          <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200 group-hover:border-indigo-400'}`}>
                            {isSelected && <FiCheck className="text-white text-xs" />}
                          </div>
                          <span className={`text-sm font-semibold transition-colors ${isSelected ? 'text-[#0f172a]' : 'text-slate-500 group-hover:text-[#0f172a]'}`}>
                            {cat.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Results Grid right side */}
          <div className="flex-1">
            <div className="relative min-h-[500px]">
              {filteredTasks === undefined ? (
                <div className="flex flex-col items-center justify-center py-40 gap-6">
                  <ThreeDots height="40" width="80" color="#6366f1" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Searching Task Board...</span>
                </div>
              ) : filteredTasks.length > 0 ? (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                  <AnimatePresence mode="popLayout">
                    {filteredTasks.map((task) => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.95 }} 
                        transition={{ duration: 0.3 }}
                        layout
                        key={task.id}
                      >
                        <SearchGridItem gig={task} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="studio-paper studio-ambient rounded-[3rem] studio-ghost-border bg-white py-40 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8">
                    <FiSearch size={32} />
                  </div>
                  <h2 className="text-3xl font-black text-[#0f172a] tracking-tight mb-4">No Matching Tasks</h2>
                  <p className="text-slate-500 font-medium max-w-sm">
                    We couldn't find any available tasks matching your exact filters. Try broadening your budget or delivery time constraints.
                  </p>
                  <button 
                    onClick={clearFilters}
                    className="mt-8 px-8 py-3 bg-[#0f172a] text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-xl shadow-[#0f172a]/10"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              )}
            </div>
          </div>

        </div>

      </div>
      
      {/* Scrollbar styling for category dropdown */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}

export default Search;
