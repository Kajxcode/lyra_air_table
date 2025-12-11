"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex justify-center bg-white">
      {/* CENTER WRAPPER */}
      <div className="flex w-full max-w-[1100px]">

        {/* LEFT SIDE */}
        <div className="flex flex-1 justify-center">
          <div className="w-full max-w-[480px] px-6 sm:px-10 lg:px-16 flex flex-col justify-center">

            <img src="/airtable-logo.png" className="h-10 w-10 mb-6" />
            <h1 className="text-[26px] font-semibold mb-6">Sign in to Airtable</h1>

            <div className="scale-90 origin-top-left">

              <label className="text-sm font-medium mb-1 block">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[14px] mb-3"
                placeholder="Email address"
              />

              <button
                disabled
                className="w-full h-10 bg-[#79b1fa] text-white rounded-lg font-semibold opacity-80 cursor-not-allowed mb-4"
              >
                Continue
              </button>

              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="px-3 text-gray-500 text-sm">or</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Buttons */}
              <button className="w-full h-10 border border-gray-300 rounded-lg mb-3 cursor-pointer">
                Sign in with <span className="font-semibold">Single Sign On</span>
              </button>

              <button
                onClick={() => signIn("google", { callbackUrl: "/"})}
                className="w-full h-10 border  border-gray-300 rounded-lg flex items-center justify-center gap-2 mb-3 cursor-pointer">
                <img src="/google-icon.png" className="h-5" />
                Continue with <span className="font-semibold">Google</span>
              </button>

              <button className="w-full h-10 border  border-gray-300 rounded-lg flex items-center justify-center gap-2 cursor-pointer">
                <img src="/apple-icon.png" className="h-5" />
                Continue with <span className="font-semibold">Apple ID</span>
              </button>

              <p className="mt-6 text-sm text-gray-600">
                New to Airtable? <a className="underline font-medium">Create an account</a> instead
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex w-[420px] bg-[#3C0D63] text-white p-10 h-120 mt-30 rounded-3xl flex-col justify-center">
          <h2 className="text-[24px] font-semibold leading-tight mb-6">
            Meet Omni, your AI<br />collaborator for<br />building custom apps.
          </h2>

          <button className="bg-white text-[#3C0D63] font-semibold px-4 py-2 rounded-lg w-fit mb-8">
            Start building
          </button>
        </div>

      </div>
    </div>
  );
}
