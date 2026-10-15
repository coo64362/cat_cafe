import fs from "fs";
import path from "path";
import * as RTL from "@testing-library/react";
import "@testing-library/jest-dom";
import Page from "../app/page";

// Replace the Google font loader during tests.
jest.mock("next/font/google", () => ({
  Pixelify_Sans: () => ({ className: "test-font" }),
}));

afterEach(() => {
  RTL.cleanup();
});

function startGame() {
  const view = RTL.render(<Page />);

  RTL.fireEvent.click(
    RTL.screen.getByRole("button", { name: "Next", exact: true })
  );

  RTL.fireEvent.click(
    RTL.screen.getByRole("button", { name: "Rules", exact: true })
  );

  RTL.fireEvent.click(
    RTL.screen.getByRole("button", { name: "Start Playing" })
  );

  return view;
}

// The held fish has this class; shelf fish do not.
function getHeldFish(container: HTMLElement) {
  return container.querySelector(
    'img[src="/Sprites/Fish.png"].pointer-events-none'
  );
}

describe("useState static check", () => {
  test("page.tsx imports useState", () => {
    const filePath = path.join(__dirname, "../app/page.tsx");
    const code = fs.readFileSync(filePath, "utf-8");

    expect(code).toMatch(
      /import\s*{[^}]*\buseState\b[^}]*}\s*from\s*['"]react['"]/
    );
  });
});

describe("Fish state behavior", () => {
  test("the player starts without a fish", () => {
    const { container } = startGame();

    expect(getHeldFish(container)).not.toBeInTheDocument();

    expect(
      RTL.screen.getByRole("button", { name: "Discard held item" })
    ).toBeDisabled();
  });

  test.each([0, 1, 2, 3, 4, 5])(
    "shelf fish %i can be picked up",
    (index) => {
      const { container } = startGame();

      const fishButtons = RTL.screen.getAllByRole("button", {
        name: "Pick up fish",
        exact: true,
      });

      RTL.fireEvent.click(fishButtons[index]);

      expect(getHeldFish(container)).toBeInTheDocument();

      expect(
        RTL.screen.getByRole("button", { name: "Discard held item" })
      ).toBeEnabled();
    }
  );

  test("discarding removes the held fish", () => {
    const { container } = startGame();

    RTL.fireEvent.click(
      RTL.screen.getAllByRole("button", { name: "Pick up fish" })[0]
    );

    expect(getHeldFish(container)).toBeInTheDocument();

    RTL.fireEvent.click(
      RTL.screen.getByRole("button", { name: "Discard held item" })
    );

    expect(getHeldFish(container)).not.toBeInTheDocument();
  });

  test("another fish can be picked up after discarding", () => {
    const { container } = startGame();

    const fishButtons = RTL.screen.getAllByRole("button", {
      name: "Pick up fish",
    });

    RTL.fireEvent.click(fishButtons[0]);

    RTL.fireEvent.click(
      RTL.screen.getByRole("button", { name: "Discard held item" })
    );

    expect(fishButtons[1]).toBeEnabled();

    RTL.fireEvent.click(fishButtons[1]);

    expect(getHeldFish(container)).toBeInTheDocument();
  });
});