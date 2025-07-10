export default {
	testEnvironment: 'node',
	transform: {},
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	collectCoverageFrom: ['src/**/*.js', '!src/app.js'],
	testMatch: ['**/tests/**/*.test.js'],
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html'],
	verbose: true,
	testTimeout: 100000,
};
