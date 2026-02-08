import { useEffect, useState, useRef } from "react";
import { SunIcon, MoonIcon, CloudArrowUpIcon, CheckCircleIcon, EnvelopeIcon, PhoneIcon, SparklesIcon, ChartBarIcon,} from "@heroicons/react/24/outline";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  // 🔥 NEW STATES ADDED
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const uploadResume = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Error uploading resume");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NEW MATCHING FUNCTION ADDED
  const matchResumeToJob = () => {
    if (!result || !jobDescription.trim()) {
      alert("Please parse resume first and add job description");
      return;
    }

    const resumeSkills = result.skills.map(s => s.toLowerCase().trim());
    const jobText = jobDescription.toLowerCase();
    
    // Smart matching algorithm
    let matches = 0;
    const matchedSkills = [];
    
    resumeSkills.forEach(skill => {
      if (jobText.includes(skill)) {
        matches++;
        matchedSkills.push(skill);
      }
    });

    const matchPercentage = Math.min(100, Math.round((matches / resumeSkills.length) * 100));
    
    setMatchResult({
      percentage: matchPercentage,
      matchedSkills,
      totalSkills: resumeSkills.length
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900">
      
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float1" />
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-float2" />
        <div className="absolute top-20 left-20 w-48 h-48 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-2xl animate-float3" />
        <div className="absolute bottom-32 right-32 w-64 h-64 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-float4" />
      </div>

      {/* Main Glass Container */}
      <div className="relative w-full max-w-2xl">
        <div className="relative bg-white/20 dark:bg-slate-800/40 backdrop-blur-3xl p-10 rounded-3xl shadow-2xl border border-white/30 dark:border-slate-700/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 group">
          
          {/* Header Section */}
          <div className="flex justify-between items-start mb-10">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <SparklesIcon className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-2xl mr-3 shadow-lg" />
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Resume Matcher 🔥
                  </h1>
                  <p className="text-sm bg-gradient-to-r from-gray-500 to-gray-400 bg-clip-text text-transparent font-medium">
                    Parse + Match vs Job Description ✨
                  </p>
                </div>
              </div>
            </div>

            {/* Premium Theme Toggle */}
            <button
              onClick={() => setDark(prev => !prev)}
              className="p-4 rounded-2xl bg-gradient-to-br from-white/50 to-gray-100/50 dark:from-slate-700/50 dark:to-slate-600/50 backdrop-blur-sm border border-white/30 dark:border-slate-600/50 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 hover:rotate-12"
            >
              {dark ? (
                <SunIcon className="w-7 h-7 text-yellow-400 drop-shadow-lg" />
              ) : (
                <MoonIcon className="w-7 h-7 text-slate-700 dark:text-slate-200 drop-shadow-lg" />
              )}
            </button>
          </div>

          {/* Drag & Drop Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-3xl p-12 mb-8 transition-all duration-500 cursor-pointer group/upload hover:border-indigo-400 dark:hover:border-purple-400 overflow-hidden ${
              dragActive
                ? "border-indigo-400 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 scale-105 shadow-2xl ring-4 ring-indigo-400/30"
                : "border-white/40 dark:border-slate-600/50 hover:border-white/60 dark:hover:border-slate-500/70 hover:shadow-xl"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClickUpload}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-40 group-hover/upload:translate-x-20 transition-transform duration-1000" />
            
            <input
              ref={fileInputRef}
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx"
            />
            
            <div className="relative text-center z-10">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover/upload:scale-110 transition-all duration-300 hover:shadow-3xl">
                <CloudArrowUpIcon className="w-14 h-14 text-white" />
              </div>
              
              <p className="text-2xl font-bold bg-gradient-to-r from-slate-700 via-gray-700 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent mb-2 group-hover/upload:scale-105 transition-transform">
                {file ? `📄 ${file.name.slice(0, 25)}${file.name.length > 25 ? '...' : ''}` : "Drop your resume"}
              </p>
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-6 opacity-90">
                {file ? "✅ Ready to parse!" : "Click or drag PDF/DOC files (max 5MB)"}
              </p>
              
              {loading && (
                <div className="flex items-center justify-center space-x-3 p-4 bg-white/30 dark:bg-slate-700/40 rounded-2xl backdrop-blur-sm">
                  <div className="w-8 h-8 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin shadow-lg" />
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">Parsing your resume...</span>
                </div>
              )}
            </div>
          </div>

          {/* Parse Button */}
          <button
            onClick={uploadResume}
            disabled={!file || loading}
            className="w-full py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-black text-lg rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 relative overflow-hidden group/btn"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center justify-center space-x-3">
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="w-6 h-6" />
                  <span>🚀 Parse My Resume</span>
                </>
              )}
            </span>
          </button>

          {/* 🔥 NEW JOB DESCRIPTION SECTION */}
          {result && (
            <>
              <div className="mt-8 p-6 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-3xl border-2 border-purple-200/50 mb-6">
                <h3 className="text-2xl font-bold mb-4 flex items-center text-purple-800 dark:text-purple-300">
                  <ChartBarIcon className="w-8 h-8 mr-2" />
                  Job Description Matcher
                </h3>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste job description here...&#10;Example: 'Looking for React Developer with 3+ years experience in React, Node.js, AWS, Docker...'"
                  className="w-full h-32 p-6 rounded-2xl bg-white/70 dark:bg-slate-500/70 backdrop-blur-sm border border-purple-300/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 resize-vertical text-lg placeholder-slate-500"
                />
                <button
                  onClick={matchResumeToJob}
                  disabled={!jobDescription.trim()}
                  className="w-full mt-4 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50"
                >
                  🔥 Calculate Match Score
                </button>
              </div>

              {/* 🔥 NEW MATCH RESULTS */}
              {matchResult && (
                <div className="mb-8 p-8 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-3xl backdrop-blur-sm border-2 border-emerald-400/40 shadow-2xl">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center bg-white/80 dark:bg-slate-800/90 rounded-3xl p-6 backdrop-blur-xl shadow-2xl mb-4">
                      <ChartBarIcon className="w-12 h-12 text-emerald-500 mr-4" />
                      <div>
                        <div className="text-5xl font-black bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
                          {matchResult.percentage}%
                        </div>
                        <div className="text-xl font-bold text-slate-700 dark:text-slate-200 mt-1">
                          Skill Match Score
                        </div>
                      </div>
                    </div>
                    <p className="text-2xl font-semibold text-emerald-700 dark:text-emerald-400">
                      {matchResult.percentage >= 80 ? "🎉 Perfect Fit!" : matchResult.percentage >= 60 ? "👍 Great Match!" : "💡 Room for Improvement"}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-xl mb-4 flex items-center text-emerald-500">
                        ✅ Matched Skills ({matchResult.matchedSkills.length}/{matchResult.totalSkills})
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {matchResult.matchedSkills.map((skill, i) => (
                          <span key={i} className="px-4 py-2 bg-emerald-100/80 dark:bg-emerald-900/60 rounded-xl backdrop-blur-sm border border-emerald-300/50 text-emerald- dark:text-emerald-200 font-bold text-sm shadow-md">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Results Section */}
          {result && (
            <div className="mt-10 pt-8 border-t border-white/30 dark:border-slate-700/50">
              <div className="flex items-center mb-6 p-4 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-2xl backdrop-blur-sm border border-green-400/30">
                <CheckCircleIcon className="w-10 h-10 text-green-500 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-green-700 dark:text-green-400">Parsed Successfully!</h3>
                  <p className="text-green-600 dark:text-green-500 text-sm">Extracted {result.skills?.length || 0} skills</p>
                </div>
              </div>

              <div className="grid gap-4">
                {/* Email Card */}
                <div className="group p-6 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-2xl backdrop-blur-sm border border-blue-400/30 hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="flex items-center mb-2">
                    <EnvelopeIcon className="w-6 h-6 text-blue-500 mr-3" />
                    <span className="font-semibold text-slate-700 dark:text-slate-200 text-lg">Email</span>
                  </div>
                  <p className="text-2xl font-mono font-bold text-slate-800 dark:text-white">{result.email}</p>
                </div>

                {/* Phone Card */}
                <div className="group p-6 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-2xl backdrop-blur-sm border border-emerald-400/30 hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="flex items-center mb-2">
                    <PhoneIcon className="w-6 h-6 text-emerald-500 mr-3" />
                    <span className="font-semibold text-slate-700 dark:text-slate-200 text-lg">Phone</span>
                  </div>
                  <p className="text-2xl font-mono font-bold text-slate-800 dark:text-white">{result.phone}</p>
                </div>

                {/* Skills Grid */}
                <div className="p-6 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-2xl backdrop-blur-sm border border-purple-400/30">
                  <div className="flex items-center mb-4">
                    <SparklesIcon className="w-7 h-7 text-purple-500 mr-3" />
                    <h4 className="text-xl font-bold text-slate-700 dark:text-slate-200">
                      Skills ({result.skills?.length || 0})
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {result.skills?.map((skill, i) => (
                      <div
                        key={i}
                        className="group/skill px-4 py-3 bg-white/40 dark:bg-slate-700/50 backdrop-blur-sm rounded-xl border border-white/50 dark:border-slate-600/50 hover:bg-white/60 dark:hover:bg-slate-600/60 hover:shadow-lg transition-all hover:scale-105 hover:-translate-y-1"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <style jsx>{`
        @keyframes float1 {
         0%, 100% { transform: translateY(0px) rotate(0deg); }
         50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float2 {
         0%, 100% { transform: translateY(0px) rotate(0deg); }
         50% { transform: translateY(-30px) rotate(-180deg); }
        }
        @keyframes float3 {
         0%, 100% { transform: translateY(0px) rotate(0deg); }
         50% { transform: translateY(-25px) rotate(90deg); }
        }
        @keyframes float4 {
         0%, 100% { transform: translateY(0px) rotate(0deg); }
         50% { transform: translateY(-35px) rotate(-90deg); }
        }
        .animate-float1 { animation: float1 20s ease-in-out infinite; }
        .animate-float2 { animation: float2 25s ease-in-out infinite; }
        .animate-float3 { animation: float3 18s ease-in-out infinite; }
        .animate-float4 { animation: float4 22s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

export default App;
