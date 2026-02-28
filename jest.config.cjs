/** @type {import('jest').Config} */
const config = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>"],
    testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: {
                    jsx: "react",
                    esModuleInterop: true,
                    allowSyntheticDefaultImports: true,
                },
            },
        ],
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
        "^@engine/(.*)$": "<rootDir>/src/core/ecs/$1",
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "app/api/**/*.{ts,tsx}",
        "!src/**/*.d.ts",
        "!src/**/*.stories.{ts,tsx}",
    ],
    coverageReporters: ["text", "lcov", "html"],
    coverageThreshold: {
        global: {
            lines: 25,
            statements: 25,
            functions: 30,
            branches: 20,
        },
    },
    coveragePathIgnorePatterns: ["/node_modules/", "/__tests__/"],
};

module.exports = config;
