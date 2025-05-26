import type { Config } from "jest";

const config: Config = {
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  testTimeout: 90000,
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  testMatch: ["**/?(*.)+(spec|test).ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  moduleNameMapper: {
    "^@app/(.*)$": "<rootDir>/src/app/$1",
    "^@config/(.*)$": "<rootDir>/src/common/config/$1",
    "^@data/(.*)$": "<rootDir>/src/common/data/$1",
    "^@middleware/(.*)$": "<rootDir>/src/common/middleware/$1",
    "^@exception/(.*)$": "<rootDir>/src/common/exception/$1",
    "^@types/(.*)$": "<rootDir>/src/common/types/$1",
    "^@util/(.*)$": "<rootDir>/src/common/util/$1",
    "^src/(.*)$": "<rootDir>/src/$1",
  },
};

export default config;
