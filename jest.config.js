module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    coverageDirectory: '../coverage',
    collectCoverageFrom: ['**/*.(t|j)s'],
    moduleNameMapper: {
        '^@config/(.*)$': '<rootDir>/src/config/$1',
        '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    },
};
