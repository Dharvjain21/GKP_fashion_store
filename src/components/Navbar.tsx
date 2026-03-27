import { useState } from "react";
import { Search, LogIn, LogOut, LayoutDashboard, X } from "lucide-react";
import { useApp } from "../context/AppContext";

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const { isAdmin, logout, setSearchQuery, searchQuery } = useApp();
  const [inputVal, setInputVal] = useState(searchQuery);

  const handleSearch = (val: string) => {
    setInputVal(val);
    setSearchQuery(val);
    if (currentPage !== "home") onNavigate("home");
  };

  const clearSearch = () => {
    setInputVal("");
    setSearchQuery("");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-3 py-2.5 flex items-center gap-3">

        {/* ── Logo ── */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 shrink-0"
        >
          <img
            src="/gkp-logo.png"
            alt="GKP Logo"
            className="h-9 w-9 object-contain rounded-lg"
            onError={(e) => {
              // Fallback if image fails
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="hidden sm:block leading-tight">
            <p className="text-base font-800 text-gray-900 font-bold tracking-wide">GKP</p>
            <p className="text-[9px] text-pink-500 font-medium leading-none">Guru Kripa Paridhan</p>
          </div>
        </button>

        {/* ── Search Bar ── */}
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400"
          />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search sarees, kurtis, kids wear..."
            className="w-full pl-9 pr-9 py-2 text-sm bg-pink-50 border border-pink-200 rounded-full outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition placeholder:text-gray-400"
          />
          {inputVal && (
            <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-2 shrink-0">
          {isAdmin ? (
            <>
              <button
                onClick={() => onNavigate("admin")}
                className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold px-3 py-2 rounded-full shadow-sm hover:shadow-md transition"
              >
                <LayoutDashboard size={14} />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button
                onClick={() => { logout(); onNavigate("home"); }}
                className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-2 rounded-full transition"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate("login")}
              className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-full transition"
            >
              <LogIn size={14} />
              <span className="hidden sm:inline">Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
