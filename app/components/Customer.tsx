"use client";

import { useEffect, useRef, useState } from "react";
import Cup, { type CupType } from "./Cup";

type Drink = Exclude<CupType, "empty">;

export type Order = {
  drink: Drink | null;
  fish: boolean;
};

type CustomerData = {
  sprite: number;
  order: Order;
};

const drinks: Drink[] = ["coffee", "tea", "milkCoffee", "milkTea"];

function generateCustomer(): CustomerData {
  // 0 = drink, 1 = drink + fish, 2 = fish only
  const orderType = Math.floor(Math.random() * 3);

  return {
    sprite: Math.floor(Math.random() * 4),
    order: {
      drink:
        orderType === 2
          ? null
          : drinks[Math.floor(Math.random() * drinks.length)],
      fish: orderType !== 0,
    },
  };
}

type CustomerProps = {
  customerId: number;
  onOrderReady: (id: number, order: Order) => void;
  fishReceived: boolean;
  drinkReceived: boolean;
  secondsRemaining: number;
};

export default function Customer({
  customerId,
  onOrderReady,
  fishReceived,
  drinkReceived,
  secondsRemaining,
}: CustomerProps) {
  const [customer, setCustomer] = useState<CustomerData | null>(null);

  useEffect(() => {
    const generated = generateCustomer();

    setCustomer(generated);
    onOrderReady(customerId, generated.order);
  }, [customerId, onOrderReady]);

  const initialPatience = useRef(secondsRemaining);

  const patienceFraction = Math.max(
    0,
    Math.min(1, secondsRemaining / (initialPatience.current || 1))
  );

  if (!customer) return null;

  return (
    <div className="customer-arrival">
      <div className="customer-hop relative">
        {/* Patience meter */}
        <div
          className="
            pointer-events-none absolute -top-[12px] left-1/2 z-20
            w-[60px] -translate-x-1/2
          "
        >
          <div
            role="progressbar"
            aria-label="Customer patience"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(patienceFraction * 100)}
            className="
              h-[7px] overflow-hidden
              border border-[#513323] bg-[#fff1d6]
              shadow-[1px_1px_0_#513323]
            "
          >
            <div
              className={`h-full transition-[width] duration-100 ease-linear ${
                patienceFraction > 0.5
                  ? "bg-[#91a477]"
                  : patienceFraction > 0.25
                    ? "bg-[#e5b65a]"
                    : "bg-[#cc6767]"
              }`}
              style={{ width: `${patienceFraction * 100}%` }}
            />
          </div>

          <p className="mt-[1px] text-center text-[5px] font-bold text-[#513323]">
            {Math.ceil(secondsRemaining)}s
          </p>
        </div>
        
        {/* Thought bubble */}
        <div
          className="
            absolute top-[-20%] left-[75px] z-10
            flex w-max -translate-x-1/2 items-center gap-2
            rounded-full border-2 border-[#513323]
            bg-[#fff1d6] px-4 py-3 origin-bottom scale-[0.5]
          "
        >
          {customer.order.drink && !drinkReceived && (
            <div className="flex h-[45px] w-[54px] items-center justify-center">
              <div className="flex shrink-0 scale-[0.6]">
                <Cup type={customer.order.drink} />
              </div>
            </div>
          )}

          {customer.order.fish && !fishReceived && (
            <img
              src="/Sprites/Fish.png"
              alt="Fish"
              className="h-[40px] w-[54px] shrink-0 object-contain"
              style={{ imageRendering: "pixelated" }}
            />
          )}

          <span
            aria-hidden="true"
            className="
              absolute -bottom-4 left-1/2
              h-3 w-3 rounded-full
              border-2 border-[#513323] bg-[#fff1d6]
            "
          />

          <span
            aria-hidden="true"
            className="
              absolute -bottom-7 left-[45%]
              h-2 w-2 rounded-full
              border border-[#513323] bg-[#fff1d6]
            "
          />
        </div>

        {/* Customer: half-size version of a 200 × 250 frame */}
        <div
          role="img"
          aria-label="Cat customer"
          className="h-[125px] w-[100px] origin-bottom scale-[1]"
          style={{
            backgroundImage: "url('/Sprites/Kitstumers.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "400px 125px",
            backgroundPosition: `${customer.sprite * -100}px 0px`,
            imageRendering: "pixelated",
          }}
        />
      </div>
    </div>
  );
}