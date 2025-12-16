"use client";

import { useState } from "react";
import { LucideHouse } from "lucide-react";

export default function BasesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-[#f7f7f7] text-gray-900">
      {/* SIDEBAR — full height */}
      <aside
        className={`bg-white border-r border-gray-300 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-16" : "w-0 overflow-hidden"
        }`}
      >
        <nav className="space-y-1 px-2 pt-4 text-sm">
          <button className="w-full flex items-center justify-center py-2 rounded hover:bg-gray-100">
            <LucideHouse className="h-5 w-5" />
          </button>
        </nav>
      </aside>

      {/* RIGHT PANE */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <div className="h-14 border-b border-gray-200 bg-white flex items-center relative px-4">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-8 w-8 flex items-center justify-center rounded hover:bg-gray-100"
            >
              ☰
            </button>

            <div className="h-8 w-8 rounded-lg bg-red-500 flex items-center justify-center text-white font-bold">
              A
            </div>

            <span className="font-semibold truncate">Bases</span>
          </div>

          {/* CENTER NAV */}
          <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 h-full">
            {["Data", "Automations", "Interfaces", "Forms"].map((label, i) => (
              <button
                key={label}
                className={`relative h-full text-sm font-medium ${
                  i === 0
                    ? "text-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {label}
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
                )}
              </button>
            ))}
          </nav>

          {/* RIGHT */}
          <div className="ml-auto flex items-center gap-3">
            <button className="px-4 py-1 rounded-md bg-red-500 text-white text-sm font-medium">
              Share
            </button>
            <div className="h-8 w-8 bg-gray-300 rounded-full" />
          </div>
        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
