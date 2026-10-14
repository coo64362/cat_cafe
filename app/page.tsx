"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Pixelify_Sans } from "next/font/google";
import Cup, { type CupType } from "./components/Cup";
import Catrista, { type Expression } from "./components/Catrista";
import Customer, {type Order } from "./components/Customer";

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
  const [customers, setCustomers] = useState<number[]>([]);
  const nextCustomerId = useRef(0);
  const [sceneScale, setSceneScale] = useState<number | null>(null);
  const [carryingFish, setCarryingFish] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [orders, setOrders] = useState<Record<number, Order>>({});
  const [fishDelivered, setFishDelivered] = useState<
    Record<number, boolean>
  >({});
  const [carryingCup, setCarryingCup] = useState<CupType | null>(null);
  const [machineCup, setMachineCup] = useState<CupType | null>(null);
  const [drinkDelivered, setDrinkDelivered] = useState<
    Record<number, boolean>
  >({});
  const [score, setScore] = useState(0);
  const [deadlines, setDeadlines] = useState<Record<number, number>>({});
  const [now, setNow] = useState(() => Date.now());

  const arrivalInterval =
  score >= 100 ? 3000 : score >= 50 ? 5000 : 6000;

  const patience =
  score >= 100 ? 10000 : score >= 50 ? 10000 : 11000;

  // Keep the latest difficulty available to the arrival timer.
  const difficultyRef = useRef({ arrivalInterval, patience });

  const customerCountRef = useRef(0);

  useEffect(() => {
    customerCountRef.current = customers.length;
  }, [customers.length]);

  useEffect(() => {
    difficultyRef.current = { arrivalInterval, patience };
  }, [arrivalInterval, patience]);

  function handleMachineCup() {
    if (carryingFish) return;

    // Place the carried cup on an empty machine.
    if (machineCup === null && carryingCup !== null) {
      setMachineCup(carryingCup);
      setCarryingCup(null);
      return;
    }

      // Pick up the cup from the machine.
    if (machineCup !== null && carryingCup === null) {
      setCarryingCup(machineCup);
      setMachineCup(null);
    }
  }

  function fillCup(ingredient: "coffee" | "tea" | "milk") {
    setMachineCup((current) => {
      if (current === null) return null;

      if (ingredient === "coffee" && current === "empty") {
        return "coffee";
      }

      if (ingredient === "tea" && current === "empty") {
        return "tea";
      }

      if (ingredient === "milk") {
        if (current === "coffee") return "milkCoffee";
        if (current === "tea") return "milkTea";
      }

      return current;
    });
  }

  useEffect(() => {
    if ((expression === "neutral")) return;

    const timeout = window.setTimeout(() => {
      setExpression("neutral");
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [expression]);

  const registerOrder = useCallback((id: number, order: Order) => {
    setOrders((current) => ({ ...current, [id]: order }));
  }, []);

  useEffect(() => {
    if (!carryingFish && carryingCup === null) return;

    function followMouse(event: PointerEvent) {
      setMouse({ x: event.clientX, y: event.clientY });
    }

    window.addEventListener("pointermove", followMouse);

    return () => window.removeEventListener("pointermove", followMouse);
  }, [carryingFish, carryingCup]);

  function giveFish(customerId: number) {
    if (!carryingFish) return;

    const order = orders[customerId];
    if (!order) return;

    // Wrong item: consume the fish and make the customer leave.
    if (!order.fish) {
      setExpression("sad");
      setCarryingFish(false);
      setScore((current) => Math.max(0, current - 5));

      setCustomers((current) =>
        current.filter((id) => id !== customerId)
      );

      return;
    }

    // They already received their fish.
    if (fishDelivered[customerId]) {
      return;
    }

        setCarryingFish(false);
        setFishDelivered((current) => ({
          ...current,
          [customerId]: true,
        }));
        setExpression("happy");

        // Fish-only orders are now complete.
        if (order.drink === null || drinkDelivered[customerId]) { 
          setScore((current) => current + 10);

          setCustomers((current) =>
            current.filter((id) => id !== customerId)
          );
        }
      }

  function giveCup(customerId: number) {
    if (carryingCup === null) return;

    const order = orders[customerId];
    if (!order) return;

    // They already received their drink.
    if (drinkDelivered[customerId]) return;

    // Consume the cup being handed over.
    setCarryingCup(null);

    // Wrong drink, empty cup, or a fish-only order.
    if (carryingCup !== order.drink) {
      setExpression("sad");
      setCustomers((current) =>
        current.filter((id) => id !== customerId)
      );
      setScore((current) => Math.max(0, current - 5));
      return;
    }

    setDrinkDelivered((current) => ({
      ...current,
      [customerId]: true,
    }));
    setExpression("happy");

    // Leave when every requested item has been delivered.
    if (!order.fish || fishDelivered[customerId]) {
      setScore((current) => current + 10);

      setCustomers((current) =>
        current.filter((id) => id !== customerId)
      );
    }
  }

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

  // Customer arrivals
  useEffect(() => {
    if (screen !== null) return;

    let nextArrival = Date.now();

    const timer = window.setInterval(() => {
      const time = Date.now();
      if (time < nextArrival) return;

      const difficulty = difficultyRef.current;
      nextArrival = time + difficulty.arrivalInterval;

      if (customerCountRef.current >= 5) return;

      const id = nextCustomerId.current++;
      customerCountRef.current += 1;

      setCustomers((current) => [...current, id]);
      setDeadlines((current) => ({
        ...current,
        [id]: time + difficulty.patience,
      }));
    }, 250);

    return () => window.clearInterval(timer);
  }, [screen]);

  // Update the clock
  useEffect(() => {
    if (screen !== null) return;

    setNow(Date.now());

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 100);

    return () => window.clearInterval(timer);
  }, [screen]);

  // Remove customers whose patience has run out
  useEffect(() => {
    if (screen !== null) return;

    const expired = customers.filter(
      (id) => deadlines[id] !== undefined && deadlines[id] <= now
    );

    if (expired.length === 0) return;

    setCustomers((current) =>
      current.filter((id) => !expired.includes(id))
    );

    setScore((current) => Math.max(0, current - expired.length * 5));
    setExpression("sad");
  }, [now, screen, customers, deadlines]);

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
              <div
                className="absolute z-30"
                style={{
                  left: 1600,
                  top: 510,
                  width: 220,
                  height: 220,
                }}
              >
                {/* Coffee button */}
                <button
                  type="button"
                  aria-label="Add coffee"
                  onClick={() => fillCup("coffee")}
                  className="
                    absolute left-[9%] top-[5%] h-[10%] w-[10%]
                    cursor-pointer rounded border-2 border-[#513323]
                    bg-[#795548]
                  "
                />

                {/* Milk button */}
                <button
                  type="button"
                  aria-label="Add milk"
                  onClick={() => fillCup("milk")}
                  className="
                    absolute left-[34%] top-[5%] h-[10%] w-[10%]
                    cursor-pointer rounded border-2 border-[#513323]
                    bg-[#fff1d6]
                  "
                />

                {/* Tea button */}
                <button
                  type="button"
                  aria-label="Add tea"
                  onClick={() => fillCup("tea")}
                  className="
                    absolute left-[59%] top-[5%] h-[10%] w-[10%]
                    cursor-pointer rounded border-2 border-[#513323]
                    bg-[#91a477]
                  "
                />

                {/* Place or retrieve a cup */}
                <button
                  type="button"
                  aria-label={
                    machineCup === null ? "Place cup on machine" : "Pick up machine cup"
                  }
                  onClick={(event) => {
                    setMouse({ x: event.clientX, y: event.clientY });
                    handleMachineCup();
                  }}
                  className="
                    absolute bottom-[31%] left-[40%]
                    flex h-[85px] w-[100px] -translate-x-1/2
                    items-center justify-center
                    cursor-pointer border-0 bg-transparent p-0
                  "
                  >
                  {machineCup !== null && <Cup type={machineCup} />}
                </button>
              </div>

              <div className="absolute left-[56%] top-[38%] z-10 scale-[1.5]">
                <Catrista expression={expression} />
              </div>

              {customers.map((id, index) => (
                <div
                  key={id}
                  className="absolute top-[85%] z-40 scale-[1.10]"
                  style={{ left: 240 + index * 330 }}
                >
                  <div className="relative h-[125px] w-[100px] origin-bottom scale-[3]">
                    <Customer
                      customerId={id}
                      onOrderReady={registerOrder}
                      fishReceived={Boolean(fishDelivered[id])}
                      drinkReceived={Boolean(drinkDelivered[id])}
                      secondsRemaining={Math.max(
                        0,
                        ((deadlines[id] ?? now) - now) / 1000
                      )}
                    />

                    <button
                      type="button"
                      aria-label="Give carried item to this customer"
                      disabled={!carryingFish && carryingCup === null}
                      onClick={() => {
                        if (carryingFish) {
                          giveFish(id);
                        } else if (carryingCup !== null) {
                          giveCup(id);
                        }
                      }}
                      className="
                        absolute inset-0 z-30 h-full w-full
                        cursor-pointer border-0 bg-transparent p-0
                        disabled:pointer-events-none
                      "
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                aria-label="Discard held item"
                disabled={!carryingFish && carryingCup === null}
                onClick={() => {
                  setCarryingCup(null);
                  setCarryingFish(false);
                }}
                className="
                  absolute bottom-[20px] right-[20px] z-40
                  border-4 border-[#513323]
                  bg-[#c77b47] px-5 py-3
                  font-bold text-[#fff1d6]
                  cursor-pointer hover:bg-[#dc945c]
                  disabled:cursor-default disabled:opacity-50
                "
              >
                Discard Item
              </button>

              {/* Fish on the counter */}
              <button
                aria-label="Pick up fish"
                disabled={carryingFish || carryingCup !== null}
                onClick={(event) => {
                  setMouse({ x: event.clientX, y: event.clientY });
                  setCarryingFish(true);
                }}
                className="
                  absolute left-[38%] top-[52%] z-30
                  cursor-pointer border-0 bg-transparent p-0
                  disabled:opacity-50
                "
              >
                <img
                  src="/Sprites/Fish.png"
                  alt=""
                  draggable={false}
                  className="h-[75px] w-[90px] object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
              </button>

              <button
                aria-label="Pick up fish"
                disabled={carryingFish || carryingCup !== null}
                onClick={(event) => {
                  setMouse({ x: event.clientX, y: event.clientY });
                  setCarryingFish(true);
                }}
                className="
                  absolute left-[45%] top-[52%] z-30
                  cursor-pointer border-0 bg-transparent p-0
                  disabled:opacity-50
                "
              >
                <img
                  src="/Sprites/Fish.png"
                  alt=""
                  draggable={false}
                  className="h-[75px] w-[90px] object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
              </button>

              <button
                aria-label="Pick up fish"
                disabled={carryingFish || carryingCup !== null}
                onClick={(event) => {
                  setMouse({ x: event.clientX, y: event.clientY });
                  setCarryingFish(true);
                }}
                className="
                  absolute left-[38%] top-[42%] z-30
                  cursor-pointer border-0 bg-transparent p-0
                  disabled:opacity-50
                "
              >
                <img
                  src="/Sprites/Fish.png"
                  alt=""
                  draggable={false}
                  className="h-[75px] w-[90px] object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
              </button>

              <button
                aria-label="Pick up fish"
                disabled={carryingFish || carryingCup !== null}
                onClick={(event) => {
                  setMouse({ x: event.clientX, y: event.clientY });
                  setCarryingFish(true);
                }}
                className="
                  absolute left-[45%] top-[42%] z-30
                  cursor-pointer border-0 bg-transparent p-0
                  disabled:opacity-50
                "
              >
                <img
                  src="/Sprites/Fish.png"
                  alt=""
                  draggable={false}
                  className="h-[75px] w-[90px] object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
              </button>

              <button
                aria-label="Pick up fish"
                disabled={carryingFish || carryingCup !== null}
                onClick={(event) => {
                  setMouse({ x: event.clientX, y: event.clientY });
                  setCarryingFish(true);
                }}
                className="
                  absolute left-[38%] top-[32%] z-30
                  cursor-pointer border-0 bg-transparent p-0
                  disabled:opacity-50
                "
              >
                <img
                  src="/Sprites/Fish.png"
                  alt=""
                  draggable={false}
                  className="h-[75px] w-[90px] object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
              </button>

              <button
                aria-label="Pick up fish"
                disabled={carryingFish || carryingCup !== null}
                onClick={(event) => {
                  setMouse({ x: event.clientX, y: event.clientY });
                  setCarryingFish(true);
                }}
                className="
                  absolute left-[45%] top-[32%] z-30
                  cursor-pointer border-0 bg-transparent p-0
                  disabled:opacity-50
                "
              >
                <img
                  src="/Sprites/Fish.png"
                  alt=""
                  draggable={false}
                  className="h-[75px] w-[90px] object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
              </button>

              {/* Cup shelf */}
              <button
                type="button"
                aria-label="Pick up an empty cup"
                disabled={carryingFish || carryingCup !== null}
                onClick={(event) => {
                  setMouse({ x: event.clientX, y: event.clientY });
                  setCarryingCup("empty");
                }}
                className="
                  absolute left-[76%] top-[32%] z-30
                  cursor-pointer border-0 bg-transparent p-0
                  disabled:opacity-50
                "
              >
                <Cup type="empty" />
              </button>
              <button
                type="button"
                aria-label="Pick up an empty cup"
                disabled={carryingFish || carryingCup !== null}
                onClick={(event) => {
                  setMouse({ x: event.clientX, y: event.clientY });
                  setCarryingCup("empty");
                }}
                className="
                  absolute left-[76%] top-[42%] z-30
                  cursor-pointer border-0 bg-transparent p-0
                  disabled:opacity-50
                "
              >
                <Cup type="empty" />
              </button>
              <button
                type="button"
                aria-label="Pick up an empty cup"
                disabled={carryingFish || carryingCup !== null}
                onClick={(event) => {
                  setMouse({ x: event.clientX, y: event.clientY });
                  setCarryingCup("empty");
                }}
                className="
                  absolute left-[76%] top-[52%] z-30
                  cursor-pointer border-0 bg-transparent p-0
                  disabled:opacity-50
                "
              >
                <Cup type="empty" />
              </button>
              <button
                type="button"
                aria-label="Pick up an empty cup"
                disabled={carryingFish || carryingCup !== null}
                onClick={(event) => {
                  setMouse({ x: event.clientX, y: event.clientY });
                  setCarryingCup("empty");
                }}
                className="
                  absolute left-[83%] top-[32%] z-30
                  cursor-pointer border-0 bg-transparent p-0
                  disabled:opacity-50
                "
              >
                <Cup type="empty" />
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
                  kitten customers the correct order. Try to earn as many
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
                      <p>Customers may also order fish.</p>
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

      {screen === null && carryingFish && (
        <img
          src="/Sprites/Fish.png"
          alt=""
          draggable={false}
          className="pointer-events-none fixed z-[60] object-contain"
          style={{
            left: mouse.x,
            top: mouse.y,
            width: 90 * (sceneScale ?? 1),
            height: 75 * (sceneScale ?? 1),
            transform: "translate(-50%, -50%)",
            imageRendering: "pixelated",
          }}
        />
      )}

      {screen === null && carryingCup !== null && (
        <div
          className="pointer-events-none fixed z-[60]"
          style={{
            left: mouse.x,
            top: mouse.y,
            width: 90,
            height: 75,
            transform: `translate(-50%, -50%) scale(${sceneScale ?? 1})`,
            transformOrigin: "center",
          }}
        >
          <Cup type={carryingCup} />
        </div>
      )}

      {screen === null && (
        <div
          className="
            absolute left-4 top-4 z-40
            border-4 border-[#513323]
            bg-[#fff1d6] px-5 py-3
            text-2xl font-bold text-[#513323]
            shadow-[4px_4px_0_0_#513323]
          "
        >
          Score: {score}
        </div>
      )}
    </main>
  );
}