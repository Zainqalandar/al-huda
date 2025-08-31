"use client";
import { useEffect, useState } from "react";
import { Search, Menu, X } from "lucide-react";
import QuranPage from "../quran/QuranPage";

const surahs = [
  { number: 1, name: "Al-Fatihah" },
  { number: 2, name: "Al-Baqarah" },
  { number: 3, name: "Ali 'Imran" },
  { number: 4, name: "An-Nisa" },
  { number: 5, name: "Al-Ma'idah" },
  { number: 6, name: "Al-An'am" },
  { number: 7, name: "Al-A'raf" },
  { number: 8, name: "Al-Anfal" },
  { number: 9, name: "At-Tawbah" },
  { number: 10, name: "Yunus" },
];

export default function QuranLayout() {
  const [active, setActive] = useState(1); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

   useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreen(); // initial check
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <div className="flex  flex-col bg-green-50">
      {/* Top Navbar - Always Full Width */}
      <header className="bg-green-100 border-b border-green-300 p-4 flex items-center gap-4 fixed top-[65px] left-0 right-0 z-50">
        <button
          className="text-green-900 cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-green-900">Quran App</h1>
      </header>

      <div className="flex flex-1 pt-[64px]"> 
        {/* Sidebar */}
        <div
          className={`fixed md:fixed top-[126px] left-0 h-[calc(100%-57px)] w-64 bg-green-950 text-green-50 flex flex-col border-r border-green-800 transform transition-transform duration-100 z-40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* Header inside Sidebar */}
          <div className="px-4 py-3 border-b border-green-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-green-200">
              {surahs.find((s) => s.number === active)?.name}
            </h2>
            <button
              className="text-green-300 cursor-pointer"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Search + Filters */}
          <div className="px-4 py-3 space-y-2 border-b border-green-800">
            <div className="flex gap-2">
              <button className="bg-green-700 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600">
                Surah
              </button>
              <button className="bg-green-800 text-green-200 px-3 py-1 rounded-md text-sm hover:bg-green-700">
                Verse
              </button>
              <button className="bg-green-800 text-green-200 px-3 py-1 rounded-md text-sm hover:bg-green-700">
                Juz
              </button>
            </div>
            <div className="flex items-center bg-green-800 px-2 py-1 rounded-md">
              <Search size={16} className="text-green-300" />
              <input
                type="text"
                placeholder="Search Surah"
                className="bg-transparent outline-none text-sm text-green-100 ml-2 w-full"
              />
            </div>
          </div>

          {/* Surah List */}
          <div className="flex-1 overflow-y-auto">
            {surahs.map((s) => (
              <button
                key={s.number}
                onClick={() => {
                  setActive(s.number);
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
                className={`flex items-center justify-between w-full px-4 py-2 text-left text-sm transition ${
                  active === s.number
                    ? "bg-green-700 text-white font-semibold"
                    : "text-green-200 hover:bg-green-800"
                }`}
              >
                <span>{s.number} {s.name}</span>
                <span
                  className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${
                    active === s.number
                      ? "bg-green-600 text-white"
                      : "bg-green-900 text-green-400"
                  }`}
                >
                  {s.number}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && isMobile < 768 && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Body Content */}
        <main
          className={`flex-1 flex flex-col transition-all duration-300 ${
            sidebarOpen ? "md:ml-64" : "md:ml-0"
          }`}
        >
          
          <QuranPage />
        </main>
      </div>
    </div>
  );
}
