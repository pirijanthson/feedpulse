module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  forceExit: true,
  detectOpenHandles: false,
  testTimeout: 30000,
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/server.ts",
  ],
};