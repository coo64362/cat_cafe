"use client";

import Image from "next/image";
import { useState } from "react";
import { Pixelify_Sans } from "next/font/google";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
});

export default function Home() {
  const [screen, setScreen] = useState<"welcome" | "intro" |"rules" | null>(
    "welcome"
  );

  return (
    <div>
      <img
          src="/Sprites/Background.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ imageRendering: "pixelated" }}
        />

        {screen !== null && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-title"
            className={ `${pixelify.className} w-full max-w-md border-4 border-[#513323] 
            bg-[#fff1d6] p-8 text-center font-bold text-[#513323] 
            shadow-[8px_8px_0_0_#513323]` }
          >
            {screen === "welcome" && (
              <>
                <h1 id="popup-title" className="mb-4 text-3xl font-bold">
                  Welcome to the Cat Cafe!
                </h1>
                <p className="mb-6">
                  Developement: Luna Kilpatrick and Olive Obianagha
                </p>
                <p className="mb-6">
                  Sprite Art: Luna Kilpatrick
                </p>
                <p className="mb-6">
                  Background Art: Angel Uribe
                </p>
                <button
                  autoFocus
                  onClick={() => setScreen("rules")}
                  className="
                    border-4 border-[#513323]
                    bg-[#c77b47] px-6 py-3 font-bold text-[#fff1d6]
                    cursor-pointer
                    hover:bg-[#dc945c]
                    active:translate-x-1 active:translate-y-1 active:shadow-none
                    focus-visible:outline focus-visible:outline-2
                    focus-visible:outline-offset-4 focus-visible:outline-[#513323]
                  "
                >
                  Next
                </button>
              </>
            )}

            {screen === "intro" && (
              <>
                <h2 id="popup-title" className="mb-4 text-3xl font-bold">
                  How to Play
                </h2>
                <p className="mb-6">Serve customers and keep your cats happy.</p>
                <button
                  autoFocus
                  onClick={() => setScreen(null)}
                  className="
                    border-4 border-[#513323]
                    bg-[#c77b47] px-6 py-3 font-bold text-[#fff1d6]
                    cursor-pointer
                    hover:bg-[#dc945c]
                    active:translate-x-1 active:translate-y-1 active:shadow-none
                    focus-visible:outline focus-visible:outline-2
                    focus-visible:outline-offset-4 focus-visible:outline-[#513323]
                  "
                >
                  Next
                </button>
              </>
            )}

            {screen === "rules" && (
              <>
                <h2 id="popup-title" className="mb-4 text-3xl font-bold">
                  A Little Tip
                </h2>
                <p className="mb-6">Happy cats make a happy cafe!</p>
                <button
                  autoFocus
                  onClick={() => setScreen("intro")}
                  className="
                    border-4 border-[#513323]
                    bg-[#c77b47] px-6 py-3 font-bold text-[#fff1d6]
                    cursor-pointer
                    hover:bg-[#dc945c]
                    active:translate-x-1 active:translate-y-1 active:shadow-none
                    focus-visible:outline focus-visible:outline-2
                    focus-visible:outline-offset-4 focus-visible:outline-[#513323]
                  "
                >
                  Start Playing
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
