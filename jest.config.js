export default {
	testEnvironment: 'node',
	collectCoverageFrom: ['src/**/*.js', '!src/app.js'],
	testMatch: ['**/tests/**/*.test.js'],
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html'],
	verbose: true,
	testTimeout: 10000,
};
