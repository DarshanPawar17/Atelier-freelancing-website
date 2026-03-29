// @ts-nocheck
import Image from "next/image";
import React from "react";
import { FiCamera, FiX, FiCheckCircle } from "react-icons/fi";

function ImageUpload({ files, setFile }) {
  const { useState } = React;
  const [message, setMessage] = useState();

  const handleFile = (e) => {
    setMessage("");
    let fileList = Array.from(e.target.files);
    let validFiles = [];

    for (let i = 0; i < fileList.length; i++) {
      const fileType = fileList[i]["type"];
      const validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/webp"];
      if (validImageTypes.includes(fileType)) {
        validFiles.push(fileList[i]);
      } else {
        setMessage("Only valid architectural assets accepted (PNG, JPG, WEBP)");
      }
    }
    setFile([...files, ...validFiles]);
  };

  const removeImage = (name) => {
    setFile(files.filter((x) => x.name !== name));
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-1 text-center mb-4">
        {message && (
          <span className="text-[10px] font-black uppercase tracking-widest text-red-500 animate-pulse">
            {message}
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-center w-full">
        <label className="flex cursor-pointer flex-col w-full h-40 border-2 border-dashed border-slate-200 rounded-[2rem] bg-white hover:bg-slate-50 hover:border-indigo-400 transition-all group overflow-hidden relative">
          <div className="flex flex-col items-center justify-center h-full gap-3">
             <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-500">
               <FiCamera size={24} />
             </div>
             <div className="text-center">
                <p className="text-xs font-black uppercase tracking-widest text-[#0f172a] opacity-80 group-hover:opacity-100">Click to upload assets</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">PNG, JPG or WEBP</p>
             </div>
          </div>
          <input
            type="file"
            onChange={handleFile}
            className="absolute inset-0 opacity-0 cursor-pointer"
            multiple={true}
            name="files[]"
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-6">
          {files.map((file, key) => (
            <div key={key} className="relative group w-24 h-24">
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative h-full w-full rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-100 group-hover:scale-105 transition-transform duration-500">
                <Image 
                  src={URL.createObjectURL(file)} 
                  fill 
                  alt="Asset Preview" 
                  className="object-cover"
                />
                
                {/* Remove Control */}
                <div 
                  onClick={() => removeImage(file.name)}
                  className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <FiX className="text-white text-xl" />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 z-10 text-emerald-500 bg-white rounded-full">
                <FiCheckCircle size={16} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
