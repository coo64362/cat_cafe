const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

module.exports = createJestConfig({
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/.tests/**/*.test.tsx"],
});