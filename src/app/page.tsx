"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [open, setOpen] = useState(true); // NEW: sidebar state

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-gray-900 relative">

      {/* TOP BAR */}
      <div className="h-16 border-b  border-gray-300 bg-white fixed top-0 left-0 right-0 z-50 flex items-center px-6">

        {/* BURGER BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="mr-4 p-2 rounded hover:bg-gray-100"
        >
          {/* simple burger menu icon */}
          <div className="w-5 h-0.5 bg-black mb-1"></div>
          <div className="w-5 h-0.5 bg-black mb-1"></div>
          <div className="w-5 h-0.5 bg-black"></div>
        </button>

        {/* LEFT GROUP */}
        <div className="flex items-center gap-2">
          <img src="/airtable-logo.png" className="h-6 w-6" />
          <h2 className="text-lg font-semibold">Airtable</h2>
        </div>

        {/* CENTER */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <input
            placeholder="Search..."
            className="border rounded-lg border-gray-300 px-3 py-1 text-sm w-[280px] bg-gray-50"
          />
        </div>

        {/* RIGHT GROUP */}
        <div className="ml-auto flex items-center space-x-4">
          <button className="text-sm text-gray-600 hover:text-gray-900">Help</button>
          <div className="h-8 w-8 bg-gray-300 rounded-full" />
        </div>
      </div>

      <div className="flex pt-16">

        {/* COLLAPSIBLE SIDEBAR */}
        <aside
          className={`
            bg-white border-r border-gray-300 min-h-screen pt-4 flex flex-col
            transition-all duration-300
            ${open ? "w-60" : "w-0 overflow-hidden"}
          `}
        >
          <nav className="space-y-1 px-2 text-sm">
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Home</button>
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Starred</button>
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Shared</button>
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-100">Workspaces</button>
          </nav>

          <div className="mt-auto p-4">
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500">
              + Create
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1">
          <div className="p-6">

            {/* TITLE */}
            <h1 className="font-bold p-4 text-3xl">Home</h1>
            
            {/* ACTION TILES */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">

              <button className="border border-gray-300 bg-white rounded-xl p-4 text-left shadow-sm hover:shadow-md transition">
                <p className="font-semibold mb-1">Start with Omni</p>
                <p className="text-sm text-gray-500">Use AI to build a custom app.</p>
              </button>

              <button className="border border-gray-300 bg-white rounded-xl p-4 text-left shadow-sm hover:shadow-md transition">
                <p className="font-semibold mb-1">Start with templates</p>
                <p className="text-sm text-gray-500">Select a template to get started.</p>
              </button>

              <button className="border border-gray-300 bg-white rounded-xl p-4 text-left shadow-sm hover:shadow-md transition">
                <p className="font-semibold mb-1">Quickly upload</p>
                <p className="text-sm text-gray-500">Import existing projects easily.</p>
              </button>

              <button className="border border-gray-300 bg-white rounded-xl p-4 text-left shadow-sm hover:shadow-md transition">
                <p className="font-semibold mb-1">Build an app on your own</p>
                <p className="text-sm text-gray-500">Start with a blank workspace.</p>
              </button>
            </div>

            {/* EMPTY STATE */}
            <div className="text-center text-gray-500 mt-20">
              <p className="text-lg font-medium mb-2">
                You haven’t opened anything recently
              </p>
              <button
                onClick={() => router.push("/workspaces")}
                className="text-blue-600 hover:underline text-sm"
              >
                Go to all workspaces
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
