"use client";

import { useEffect, useState } from "react";
import { Pixelify_Sans } from "next/font/google";
import Cup, { type CupType } from "./components/Cup";
import Catrista, { type Expression } from "./components/Catrista";
import Customer from "./components/Customer";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
});

const SCENE_WIDTH = 1920;
const SCENE_HEIGHT = 1080;

const buttonClasses = `
  border-4 border-[#513323]
  bg-[#c77b47] px-6 py-3 font-bold text-[#fff1d6]
  cursor-pointer hover:bg-[#dc945c]
  active:translate-x-1 active:translate-y-1
  focus-visible:outline focus-visible:outline-2
  focus-visible:outline-offset-4 focus-visible:outline-[#513323]
`;

const cupRules: {
  type: CupType;
  title: string;
  description: string;
}[] = [
  {
    type: "empty",
    title: "Empty Cup",
    description: "Pick this cup from the shelf to start an order.",
  },
  {
    type: "coffee",
    title: "Coffee",
    description: "Fill an empty cup with coffee.",
  },
  {
    type: "tea",
    title: "Tea",
    description: "Fill an empty cup with tea.",
  },
  {
    type: "milkCoffee",
    title: "Milk Coffee",
    description: "Add milk to a coffee cup.",
  },
  {
    type: "milkTea",
    title: "Milk Tea",
    description: "Add milk to a tea cup.",
  },
];

export default function Home() {
  const [screen, setScreen] = useState<
    "welcome" | "intro" | "rules" | null
  >("welcome");

  const [expression, setExpression] = useState<Expression>("neutral");
  const [customerNumber, setCustomerNumber] = useState(0);
  const [sceneScale, setSceneScale] = useState<number | null>(null);

  useEffect(() => {
    function resizeScene() {
      setSceneScale(
        Math.min(
          window.innerWidth / SCENE_WIDTH,
          window.innerHeight / SCENE_HEIGHT
        )
      );
    }

    resizeScene();
    window.addEventListener("resize", resizeScene);

    return () => window.removeEventListener("resize", resizeScene);
  }, []);

  return (
    <main
      className={`${pixelify.className} fixed inset-0 overflow-hidden bg-[#241e25]`}
    >
      {/* Center the scene in the window */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="relative origin-center overflow-hidden"
          style={{
            width: SCENE_WIDTH,
            height: SCENE_HEIGHT,
            transform: `scale(${sceneScale ?? 1})`,
            visibility: sceneScale === null ? "hidden" : "visible",
          }}
        >
          <img
            src="/Sprites/Background.png"
            alt="Cat cafe"
            className="absolute inset-0 h-full w-full"
            style={{ imageRendering: "pixelated" }}
          />

          {screen === null && (
            <>
              {/* Positions are measured inside the fixed scene */}
              <div className="absolute left-[1037px] top-[378px] z-10">
                <Catrista expression={expression} />
              </div>

              <div className="absolute left-[480px] top-[702px] z-20">
                <div className="origin-bottom scale-[3]">
                  <Customer key={customerNumber} />
                </div>
              </div>

              {/* Temporary button for testing arrivals */}
              <button
                onClick={() => {
                  setCustomerNumber((number) => number + 1);
                  setExpression("neutral");
                }}
                className={`${buttonClasses} absolute bottom-6 right-6 z-30`}
              >
                Next Customer
              </button>
            </>
          )}
        </div>
      </div>

      {/* Intro stays sized for the screen */}
      {screen !== null && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-title"
            className="
              max-h-[85vh] w-full max-w-lg overflow-y-auto
              border-4 border-[#513323]
              bg-[#fff1d6] p-8 text-center font-bold text-[#513323]
              shadow-[8px_8px_0_0_#513323]
            "
          >
            {screen === "welcome" && (
              <>
                <h1
                  id="popup-title"
                  className="mb-4 text-3xl font-bold"
                >
                  Welcome to the Cat Cafe!
                </h1>

                <p className="mb-6">
                  Development: Luna Kilpatrick and Olive Obianagha
                </p>
                <p className="mb-6">Sprite Art: Luna Kilpatrick</p>
                <p className="mb-6">Background Art: Angel Uribe</p>

                <button
                  autoFocus
                  onClick={() => setScreen("intro")}
                  className={buttonClasses}
                >
                  Next
                </button>
              </>
            )}

            {screen === "intro" && (
              <>
                <h2
                  id="popup-title"
                  className="mb-4 text-3xl font-bold"
                >
                  Introduction
                </h2>

                <p className="mb-6">
                  Your job as Panda, the catrista, is to serve your
                  kitstumers the correct order. Try to earn as many
                  points as you can!
                </p>

                <button
                  autoFocus
                  onClick={() => setScreen("rules")}
                  className={buttonClasses}
                >
                  Rules
                </button>
              </>
            )}

            {screen === "rules" && (
              <>
                <h2
                  id="popup-title"
                  className="mb-4 text-3xl font-bold"
                >
                  Rules
                </h2>

                <p className="mb-6">
                  Pick an empty cup from the shelf, place it on the
                  machine, and fill it with the customer’s drink.
                </p>

                <ul className="mb-8 space-y-4 text-left">
                  {cupRules.map((rule) => (
                    <li
                      key={rule.type}
                      className="flex items-center gap-4"
                    >
                      <Cup type={rule.type} />
                      <div>
                        <h3 className="text-xl font-bold">
                          {rule.title}
                        </h3>
                        <p>{rule.description}</p>
                      </div>
                    </li>
                  ))}

                  <li className="flex items-center gap-4">
                    <img
                      src="/Sprites/Fish.png"
                      alt="Fish"
                      className="h-[75px] w-[90px] shrink-0 object-contain"
                      style={{ imageRendering: "pixelated" }}
                    />
                    <div>
                      <h3 className="text-xl font-bold">Fish</h3>
                      <p>Kitstumers may also order fish.</p>
                    </div>
                  </li>
                </ul>

                <button
                  autoFocus
                  onClick={() => setScreen(null)}
                  className={buttonClasses}
                >
                  Start Playing
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}