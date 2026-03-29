import SearchGridItem from "../components/search/SearchGridItem";
import { SEARCH_GIGS_ROUTE } from "../utils/constants";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FiSearch, FiFilter, FiZap } from "react-icons/fi";
import { ThreeDots } from "react-loader-spinner";

function Search() {
  const router = useRouter();
  const { q, category } = router.query;
  const [tasks, setTasks] = useState(undefined);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(
          `${SEARCH_GIGS_ROUTE}?searchTerm=${q || "all"}&category=${category || ""}`
        );
        setTasks(data.gigs || []);
      } catch (err) {
        console.error(err);
        setTasks([]);
      }
    };
    getData();
  }, [q, category]);

  return (
    <div className="min-h-screen bg-slate-50/50 pt-36 pb-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Search Results Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
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

          <div className="flex items-center gap-4 bg-white studio-ambient rounded-3xl p-2 studio-ghost-border">
            <div className="px-6 py-3 flex items-center gap-2 text-sm font-bold text-[#0f172a]">
              <FiFilter className="text-slate-400" />
              Filters
            </div>
            <div className="h-8 w-[1px] bg-slate-100"></div>
            <div className="px-6 py-3 text-sm font-bold border-2 border-indigo-600 text-indigo-600 rounded-2xl cursor-pointer hover:bg-indigo-600 hover:text-white transition-all">
              Relevance
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="relative">
          {tasks === undefined ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6">
              <ThreeDots height="40" width="80" color="#6366f1" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Searching Task Board...</span>
            </div>
          ) : tasks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {tasks.map((task) => (
                <SearchGridItem gig={task} key={task.id} />
              ))}
            </div>
          ) : (
            <div className="studio-paper studio-ambient rounded-[3rem] studio-ghost-border bg-white py-40 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-8">
                <FiSearch size={32} />
              </div>
              <h2 className="text-3xl font-black text-[#0f172a] tracking-tight mb-4">No Matching Tasks</h2>
              <p className="text-slate-500 font-medium max-w-sm">
                We couldn't find any available tasks matching your search criteria. Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Search;
