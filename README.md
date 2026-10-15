# Cat Cafe: Use State Assignment

Complete the fish pickup feature in an existing Cat Cafe game using React’s `useState` hook.

The game’s artwork, customers, drinks, and movement code are already provided. Your task is to track whether the player is carrying a fish.

## Learning Outcomes

By the end of this assignment, you will be able to:

- Initialize boolean state using `useState`.
- Update state in response to a button click.
- Explain how changing state updates the screen.

## File

**`app/page.tsx`** — complete the sections marked `TODO`.

## Part 1: Initialize State

The file already includes `"use client";` and imports `useState`.

Inside `function Home()`, create a state variable with:

- **`carryingFish`** — stores whether the player is holding a fish.
- **`setCarryingFish`** — updates that state.
- An initial value of **`false`**, because the player starts without a fish.

## Part 2: Pick Up a Fish

Find the six buttons with `aria-label="Pick up fish"`, below the comment `{/* Fish on the counter */}`.

Inside each button’s existing `onClick` handler, update `carryingFish` to **`true`**.

Keep the existing `setMouse(...)` code. It positions the fish beside the pointer.

The provided display code will show the held fish automatically when the state becomes `true`.

## Part 3: Discard the Fish

Find the **Discard Item** button.

Inside its existing `onClick` handler, update `carryingFish` to **`false`**.

Keep the existing `setCarryingCup(null)` line so discarding cups continues to work.

## Testing

Install dependencies:

```bash
npm install
```

Start the game:

```bash
npm run dev
```

Open the local address shown in your terminal and click through to **Start Playing**.

Check that:

1. The player starts without a fish.
2. Clicking any shelf fish makes a fish appear beside the pointer.
3. Moving the pointer moves the held fish.
4. Clicking **Discard Item** removes the held fish.
5. You can pick up another fish after discarding one.

