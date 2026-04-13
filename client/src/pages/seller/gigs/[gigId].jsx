import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ImageUpload from "../../../components/ImageUpload";
import { categories } from "../../../utils/categories";
import {
  GET_GIG_BY_ID_ROUTE,
  UPDATE_GIG_ROUTE
} from "../../../utils/constants";
import { FiPlus, FiBox, FiTrash2, FiLayers, FiPocket, FiClock, FiRepeat, FiInfo } from "react-icons/fi";
import { ThreeDots } from "react-loader-spinner";

const EditGig = () => {
  const [cookies] = useCookies();
  const router = useRouter();
  const { gigId } = router.query;
  const [loading, setLoading] = useState(false);
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
    if (data.feature) {
      setFeatures([...features, data.feature]);
      setData({ ...data, feature: "" });
    }
  };

  const removeFeature = (index) => {
    const clonedFeatures = [...features];
    clonedFeatures.splice(index, 1);
    setFeatures(clonedFeatures);
  };

  const editGig = async () => {
    const { title, category, description, time, revisions, price, shortDesc } =
      data;
    if (
      category &&
      description &&
      features.length &&
      files.length &&
      price > 0 &&
      shortDesc.length &&
      time > 0 &&
      title &&
      revisions > 0
    ) {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      const gigData = {
        title,
        description,
        category,
        time,
        revisions,
        price,
        shortDesc,
        features,
      };

      setLoading(true);
      try {
        const response = await axios.put(
          `${UPDATE_GIG_ROUTE}/${gigId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${cookies.jwt}`,
            },
            params: gigData,
          }
        );

        if (response.status === 200) {
          router.push("/seller/gigs");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const {
          data: { gig },
        } = await axios.get(`${GET_GIG_BY_ID_ROUTE}/${gigId}`);
        setData({ ...gig, time: gig.deliveryTime });
        setFeatures(gig.features);
        
        let loadedFiles = [];

        gig.images.forEach((image) => {
          const url = image;
          // Clean the file name from URL
          const fileName = image.split("/").pop();
          fetch(url).then(async (response) => {
            const contentType = response.headers.get("content-type");
            const blob = await response.blob();
            // Provide explicit MIME type fallback if headers fail, using 'type' not 'contentType'
            const file = new File([blob], fileName, { type: contentType || "image/jpeg" });
            setFiles((prev) => {
              if (prev.some(f => f.name === fileName)) return prev;
              return [...prev, file];
            });
          });
        });
      } catch (ex) {
        console.log(ex);
      }
    };
    if (gigId) {
      fetchGig();
    }
  }, [gigId]);

  const inputClassName =
    "w-full py-4 px-6 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-medium text-[#0f172a] placeholder:text-slate-400";
  const labelClassName = "flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1";

  return (
    <div className="min-h-screen bg-slate-50/50 pt-36 pb-24 px-6 md:px-16 lg:px-24">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col gap-2 mb-12">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500">Modification Hub</span>
          <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] tracking-tighter">Edit Gig</h1>
          <p className="text-slate-400 font-medium">Update your existing gig details.</p>
        </div>

        <form className="space-y-12">
          <div className="studio-paper studio-ambient rounded-[3rem] studio-ghost-border bg-white p-8 md:p-16 space-y-12">
            
            {/* Project Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col">
                <label htmlFor="title" className={labelClassName}>
                  <FiBox className="text-indigo-500" />
                  Gig Title
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
                  value={data.category}
                >
                  <option disabled value="">Select a Category</option>
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
                Detailed Gig Description
              </label>
              <textarea
                name="description"
                id="description"
                rows="6"
                className={`${inputClassName} resize-none`}
                placeholder="Explain the scope of the gig, deliverables, and your expertise..."
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
                  Gig Features / Benefits
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
                    disabled={!data.feature?.trim()}
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
                    <FiInfo /> Pre-loaded images correspond to current state. Modify to update.
                  </p>
                </div>
              </div>
            </div>

            {/* Commercial Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 md:p-12 bg-indigo-50/30 rounded-[2.5rem] border border-indigo-100/50">
              <div className="flex flex-col">
                <label htmlFor="shortDesc" className={labelClassName}>
                  Short Gig Summary
                </label>
                <input
                  type="text"
                  className={inputClassName}
                  id="shortDesc"
                  placeholder="Summarize your gig in a few words"
                  name="shortDesc"
                  value={data.shortDesc}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="price" className={labelClassName}>
                   <FiPocket className="text-indigo-500" />
                  Gig Price ( ₹ )
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

            <button
              className="w-full bg-[#0f172a] text-white py-6 rounded-[2.5rem] text-sm font-black uppercase tracking-[0.3em] studio-ambient hover:bg-[#6366f1] transition-all active:scale-95 flex justify-center items-center gap-3 shadow-xl shadow-indigo-500/10 disabled:opacity-50"
              type="button"
              onClick={editGig}
              disabled={loading}
            >
              {loading ? <ThreeDots height="24" width="40" color="#fff" /> : "Update Gig Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGig;
