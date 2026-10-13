"use client";

import { useEffect, useState } from "react";
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

export default function Customer() {
  const [customer, setCustomer] = useState<CustomerData | null>(null);

  useEffect(() => {
    setCustomer(generateCustomer());
  }, []);

  if (!customer) return null;

  return (
    <div className="customer-arrival">
      <div className="customer-hop relative">
        {/* Thought bubble */}
        <div
          className="
            absolute bottom-full left-1/2 mb-2
            flex w-max -translate-x-1/2 items-center gap-2
            rounded-full border-2 border-[#513323]
            bg-[#fff1d6] px-4 py-3 origin-bottom scale-[0.5]
          "
        >
          {customer.order.drink && (
            <div className="flex h-[45px] w-[54px] items-center justify-center">
              <div className="flex shrink-0 scale-[0.6]">
                <Cup type={customer.order.drink} />
              </div>
            </div>
          )}

          {customer.order.fish && (
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
              absolute -bottom-7 left-[55%]
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