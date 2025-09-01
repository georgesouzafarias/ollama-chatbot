export default {
	preset: 'ts-jest/presets/default-esm',
	extensionsToTreatAsEsm: ['.ts'],
	testEnvironment: 'node',
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	transform: {
		'^.+\\.ts$': ['ts-jest', { 
			useESM: true,
			tsconfig: {
				module: 'esnext',
			}
		}],
	},
	testMatch: ['**/tests/**/*.test.ts'],
	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/**/*.test.ts',
		'!src/**/*.d.ts',
	],
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html'],
	verbose: true,
	testTimeout: 100000,
	forceExit: true,
	detectOpenHandles: true,
};
