import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { reducerCases } from "../context/constants";
import { useStateProvider } from "../context/StateContext";
import { SET_USER_IMAGE, SET_USER_INFO, HOST } from "../utils/constants";
import {
  FiCamera, FiUser, FiAtSign, FiEdit3,
  FiMail, FiShield, FiCheckCircle, FiLoader,
  FiStar, FiBriefcase
} from "react-icons/fi";

function Profile() {
  const [cookies] = useCookies();
  const router = useRouter();
  const [{ userInfo }, dispatch] = useStateProvider();
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageHover, setImageHover] = useState(false);
  const [image, setImage] = useState(undefined);
  const [previewImage, setPreviewImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    userName: "",
    fullName: "",
    description: "",
  });

  useEffect(() => {
    if (userInfo) {
      setData({
        userName: userInfo.username || "",
        fullName: userInfo.fullName || "",
        description: userInfo.description || "",
      });
      if (userInfo.imageName) {
        setPreviewImage(
          userInfo.imageName.includes("http")
            ? userInfo.imageName
            : `${HOST}/uploads/${userInfo.imageName}`
        );
      }
      setIsLoaded(true);
    }
  }, [userInfo]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validTypes = ["image/gif", "image/jpeg", "image/png", "image/webp"];
    if (validTypes.includes(file.type)) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      toast.error("Please select a valid image (PNG, JPG, WEBP)");
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const setProfile = async () => {
    if (!data.userName || !data.fullName || !data.description) {
      toast.info("All fields are required to finalize your profile.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        SET_USER_INFO,
        { ...data },
        { headers: { Authorization: `Bearer ${cookies.jwt}` } }
      );

      if (response.data.userNameError) {
        setErrorMessage("Username is already taken");
        toast.error("That username is already in use. Please choose another.");
        setLoading(false);
        return;
      }

      setErrorMessage("");
      let finalImageName = userInfo?.imageName || "";

      if (image) {
        const formData = new FormData();
        formData.append("images", image);
        const {
          data: { img },
        } = await axios.post(SET_USER_IMAGE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${cookies.jwt}`,
          },
        });
        finalImageName = img;
      }

      dispatch({
        type: reducerCases.SET_USER,
        userInfo: {
          ...userInfo,
          username: data.userName,
          fullName: data.fullName,
          description: data.description,
          imageName: finalImageName,
          isProfileInfoSet: true,
        },
      });

      toast.success("Profile updated successfully!");
      router.push("/");
    } catch (err) {
      console.error("Profile update error:", err);
      const msg = err.response?.data || "Failed to update profile. Please try again.";
      toast.error(typeof msg === "string" ? msg : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full py-4 px-6 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all font-medium text-[#0f172a] placeholder:text-slate-300 text-sm";
  const labelClass =
    "flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400";

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-20 px-6">
      {isLoaded && (
        <div className="max-w-4xl mx-auto">

          {/* Page Header */}
          <div className="mb-10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-3 block">
              User Profile
            </span>
            <h1 className="text-4xl font-black text-[#0f172a] tracking-tighter">
              Your Profile
            </h1>
            <p className="text-slate-400 text-sm font-medium mt-2">
              Manage your professional identity on AtelierX.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Sidebar — Avatar + Account Info */}
            <div className="lg:col-span-1 flex flex-col gap-6">

              {/* Avatar Card */}
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 flex flex-col items-center gap-5">
                <div
                  className="relative w-32 h-32 cursor-pointer group"
                  onMouseEnter={() => setImageHover(true)}
                  onMouseLeave={() => setImageHover(false)}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-xl opacity-20 group-hover:opacity-50 transition-opacity" />
                  <div className="relative w-full h-full rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                    {previewImage ? (
                      <Image
                        src={previewImage}
                        alt="profile"
                        fill
                        className="object-cover transition-transform group-hover:scale-110 duration-500"
                      />
                    ) : (
                      <span className="text-5xl font-black text-[#0f172a]">
                        {userInfo?.email?.[0]?.toUpperCase()}
                      </span>
                    )}
                    <div
                      className={`absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
                        imageHover ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1 text-white">
                        <FiCamera size={20} />
                        <span className="text-[9px] font-black uppercase tracking-widest">
                          Change
                        </span>
                      </div>
                    </div>
                    <input
                      type="file"
                      onChange={handleFile}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      accept="image/*"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-black text-[#0f172a] tracking-tight text-lg">
                    {data.fullName || "Your Name"}
                  </p>
                  <p className="text-slate-400 text-sm font-medium">
                    @{data.userName || "username"}
                  </p>
                </div>
              </div>

              {/* Account Status Card */}
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Account Status
                </h3>

                <div className="flex items-center gap-3 text-sm">
                  <FiMail className="text-indigo-400 shrink-0" size={15} />
                  <span className="text-slate-500 font-medium truncate">{userInfo?.email}</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <FiShield className="text-emerald-500 shrink-0" size={15} />
                  <span className="text-emerald-600 font-bold">Verified Member</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <FiCheckCircle
                    className={userInfo?.isProfileInfoSet ? "text-emerald-500" : "text-slate-300"}
                    size={15}
                  />
                  <span className={`font-bold text-sm ${userInfo?.isProfileInfoSet ? "text-emerald-600" : "text-slate-400"}`}>
                    {userInfo?.isProfileInfoSet ? "Profile Complete" : "Profile Incomplete"}
                  </span>
                </div>
              </div>

              {/* Quick Stats Card */}
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Account Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl">
                    <FiStar className="text-amber-400 mb-1" size={18} />
                    <span className="text-xl font-black text-[#0f172a]">5.0</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Rating</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl">
                    <FiBriefcase className="text-indigo-400 mb-1" size={18} />
                    <span className="text-xl font-black text-[#0f172a]">{userInfo?.tasksCompleted || 0}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Gigs</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right — Edit Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 md:p-10 flex flex-col gap-8">
                <div>
                  <h2 className="text-xl font-black text-[#0f172a] tracking-tight mb-1">
                    Edit Profile Information
                  </h2>
                  <p className="text-slate-400 text-sm font-medium">
                    Changes are saved immediately upon finalization.
                  </p>
                </div>

                {/* Username */}
                <div className="flex flex-col">
                  <label className={labelClass}>
                    <FiAtSign className="text-indigo-400" size={12} />
                    Username
                  </label>
                  <input
                    className={inputClass}
                    type="text"
                    name="userName"
                    placeholder="your_handle"
                    value={data.userName}
                    onChange={handleChange}
                  />
                  {errorMessage && (
                    <span className="text-[11px] font-bold text-red-500 mt-2 ml-1">
                      {errorMessage}
                    </span>
                  )}
                </div>

                {/* Full Name */}
                <div className="flex flex-col">
                  <label className={labelClass}>
                    <FiUser className="text-indigo-400" size={12} />
                    Full Name
                  </label>
                  <input
                    className={inputClass}
                    type="text"
                    name="fullName"
                    placeholder="Your full name"
                    value={data.fullName}
                    onChange={handleChange}
                  />
                </div>

                {/* Bio */}
                <div className="flex flex-col">
                  <label className={labelClass}>
                    <FiEdit3 className="text-indigo-400" size={12} />
                    Professional Bio
                  </label>
                  <textarea
                    name="description"
                    rows={5}
                    value={data.description}
                    onChange={handleChange}
                    className={`${inputClass} resize-none`}
                    placeholder="Describe your expertise and what kind of projects you specialize in..."
                  />
                  <span className="text-[10px] text-slate-300 font-medium mt-2 text-right">
                    {data.description.length} / 500
                  </span>
                </div>

                {/* Save Button */}
                <button
                  className="w-full bg-[#0f172a] text-white py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all active:scale-95 flex justify-center items-center gap-3 disabled:opacity-60"
                  type="button"
                  onClick={setProfile}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin" size={16} />
                      Saving Changes...
                    </>
                  ) : (
                    "Save Profile"
                  )}
                </button>

                <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                  AtelierX · Secured by Secure Protocol
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
