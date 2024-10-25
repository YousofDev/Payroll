/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  preset: "ts-jest",
  moduleNameMapper: {
    "^@lib/(.*)$": "<rootDir>/src/lib/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@app/(.*)$": "<rootDir>/src/app/$1",
    "^@db/(.*)$": "<rootDir>/src/db/$1",
    "^@types/(.*)$": "<rootDir>/src/types/$1",
  },
};
