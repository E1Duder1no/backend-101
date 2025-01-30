import { JestConfigWithTsJest, createDefaultPreset } from 'ts-jest';

const config: JestConfigWithTsJest = {
    ...createDefaultPreset(),
    testEnvironment: 'node',
    testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
};

export default config;
