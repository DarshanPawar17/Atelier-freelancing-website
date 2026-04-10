import React, { useState } from "react";
import { categories } from "../../../utils/categories";
import ImageUpload from "../../../components/ImageUpload";
import axios from "axios";
import { ADD_GIG_ROUTE } from "../../../utils/constants";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { FiPlus, FiBox, FiTrash2, FiLayers, FiDollarSign, FiClock, FiRepeat, FiCheckCircle, FiArrowRight, FiInfo } from "react-icons/fi";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";

const CreateTask = () => {
  const [cookies] = useCookies();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [files, setFiles] = useState([]);
  const [features, setFeatures] = useState([]);
  const [data, setData] = useState({
    title: "",
    category: "",
    description: "",
    time: 0,
    revisions: 0,
    feature: "",
    price: 0,
    shortDesc: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const addFeature = () => {
    if (data.feature.trim()) {
      setFeatures([...features, data.feature]);
      setData({ ...data, feature: "" });
    }
  };

  const removeFeature = (index) => {
    const clonedFeatures = [...features];
    clonedFeatures.splice(index, 1);
    setFeatures(clonedFeatures);
  };

  const [validationError, setValidationError] = useState("");

  const addTask = async (e) => {
    e.preventDefault();
    setValidationError("");
    const { category, description, price, revisions, time, title, shortDesc } = data;
    
    // Explicit validation feedback
    if (!category || category === "Choose a Category" || category === "") {
      setValidationError("Please select a Service Category from the dropdown.");
      return;
    }
    if (features.length < 3) {
      setValidationError(`Please add at least 3 features. You currently have ${features.length}. (Type a feature and click 'Add')`);
      return;
    }
    if (files.length === 0) {
      setValidationError("Please upload at least one Showcase Image.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      
      files.forEach((file) => formData.append("images", file));
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("revisions", revisions);
      formData.append("time", time);
      formData.append("shortDesc", shortDesc);
      features.forEach(feature => formData.append("features[]", feature));

      const response = await axios.post(ADD_GIG_ROUTE, formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${cookies.jwt}`,
        },
      });

      if (response.status === 201) {
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error("Task creation failed:", err);
      let errorMessage = "Failed to create task. Check if all images are valid.";
      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage = JSON.stringify(err.response.data);
        }
      } else if (err.message) {
         errorMessage = err.message;
      }
      setValidationError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    "w-full py-4 px-6 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-medium text-[#0f172a] placeholder:text-slate-400";
  const labelClassName = "flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1";

  return (
    <div className="min-h-screen bg-slate-50/50 pt-36 pb-24 px-6 md:px-16 lg:px-24">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-md"></div>
          <div className="relative studio-paper studio-ambient rounded-[3rem] studio-ghost-border bg-white p-12 md:p-20 flex flex-col items-center text-center max-w-xl animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-8">
              <FiCheckCircle size={48} />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500 mb-4 block">Operation Successful</span>
            <h2 className="text-4xl font-black text-[#0f172a] tracking-tighter mb-6 leading-tight">
              New Task Successfully <br/>Posted
            </h2>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
              Your new task is now live and visible to all clients for acquisition.
            </p>
            <button
              onClick={() => router.push("/seller/gigs")}
              className="bg-[#0f172a] text-white py-5 px-12 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] studio-ambient hover:bg-[#6366f1] transition-all flex items-center gap-3"
            >
              Enter Task Board
              <FiArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-2 mb-12">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500">Creation Hub</span>
          <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tighter">Post a New Task</h1>
          <p className="text-slate-400 font-medium">Define your task details to begin commissioned acquisitions.</p>
        </div>

        <form className="space-y-12" onSubmit={addTask}>
          <div className="studio-paper studio-ambient rounded-[3rem] studio-ghost-border bg-white p-8 md:p-16 space-y-12">
            
            {/* Project Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col">
                <label htmlFor="title" className={labelClassName}>
                  <FiBox className="text-indigo-500" />
                  Task Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={data.title}
                  onChange={handleChange}
                  id="title"
                  className={inputClassName}
                  placeholder="eg. Professional Logo Design Implementation"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="category" className={labelClassName}>
                   <FiLayers className="text-indigo-500" />
                  Service Category
                </label>
                <select
                  name="category"
                  id="category"
                  className={`${inputClassName} appearance-none cursor-pointer`}
                  onChange={handleChange}
                  defaultValue="Choose a Category"
                >
                  <option disabled value="Choose a Category">Select a Category</option>
                  {categories.map(({ name }) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comprehensive Briefing */}
            <div className="flex flex-col">
              <label htmlFor="description" className={labelClassName}>
                Detailed Task Brief
              </label>
              <textarea
                name="description"
                id="description"
                rows="6"
                className={`${inputClassName} resize-none`}
                placeholder="Explain the scope of the task, deliverables, and your expertise..."
                value={data.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Technical Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col">
                <label htmlFor="delivery" className={labelClassName}>
                   <FiClock className="text-indigo-500" />
                  Estimated Delivery (Days)
                </label>
                <input
                  type="number"
                  className={inputClassName}
                  id="delivery"
                  name="time"
                  value={data.time}
                  onChange={handleChange}
                  min={1}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="revisions" className={labelClassName}>
                   <FiRepeat className="text-indigo-500" />
                  Allowed Revisions
                </label>
                <input
                  type="number"
                  id="revisions"
                  className={inputClassName}
                  name="revisions"
                  value={data.revisions}
                  onChange={handleChange}
                  min={0}
                  required
                />
              </div>
            </div>

            {/* Resource Capability Management */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col">
                <label htmlFor="features" className={labelClassName}>
                  Task Features / Benefits
                </label>
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    id="features"
                    className={inputClassName}
                    placeholder="Enter Feature (eg. Source Files)"
                    name="feature"
                    value={data.feature}
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <button
                    type="button"
                    className="bg-[#0f172a] text-white px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2 disabled:opacity-50"
                    onClick={addFeature}
                    disabled={!data.feature.trim()}
                  >
                    <FiPlus size={14} /> Add
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap min-h-[40px] p-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 py-2 px-4 bg-white border border-slate-100 rounded-xl text-xs font-bold text-[#0f172a] shadow-sm"
                    >
                      <span>{feature}</span>
                      <FiTrash2
                        className="text-slate-300 hover:text-red-500 cursor-pointer transition-colors"
                        onClick={() => removeFeature(index)}
                      />
                    </div>
                  ))}
                  {features.length < 3 && (
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest px-4 py-2">
                      <FiInfo className="text-indigo-400" />
                      Add at least {3 - features.length} more feature(s)
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col">
                <label className={labelClassName}>Showcase Image</label>
                <div className="studio-ghost-border rounded-[2rem] p-6 bg-slate-50/50">
                  <ImageUpload files={files} setFile={setFiles} />
                  <p className="text-[10px] text-slate-400 mt-3 flex items-center gap-2 italic">
                    <FiInfo /> A high-quality image helps client acquisition.
                  </p>
                </div>
              </div>
            </div>

            {/* Commercial Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 md:p-12 bg-indigo-50/30 rounded-[2.5rem] border border-indigo-100/50">
              <div className="flex flex-col">
                <label htmlFor="shortDesc" className={labelClassName}>
                  Short Task Summary
                </label>
                <input
                  type="text"
                  className={inputClassName}
                  id="shortDesc"
                  placeholder="Summarize your task in a few words"
                  name="shortDesc"
                  value={data.shortDesc}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="price" className={labelClassName}>
                   <FiPocket className="text-indigo-500" />
                  Task Price ( ₹ )
                </label>
                <input
                  type="number"
                  className={inputClassName}
                  id="price"
                  placeholder="Fixed Price"
                  name="price"
                  value={data.price}
                  onChange={handleChange}
                  required
                  min={1}
                />
              </div>
            </div>

            {validationError && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-200 text-sm font-semibold text-center mt-6 animate-in fade-in slide-in-from-bottom-2">
                {validationError}
              </div>
            )}

            <button
              className="w-full bg-[#0f172a] text-white py-6 rounded-[2.5rem] text-sm font-black uppercase tracking-[0.3em] studio-ambient hover:bg-[#6366f1] transition-all active:scale-95 flex justify-center items-center gap-3 shadow-xl shadow-indigo-500/10 disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? <ThreeDots height="24" width="40" color="#fff" /> : "Post This Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
