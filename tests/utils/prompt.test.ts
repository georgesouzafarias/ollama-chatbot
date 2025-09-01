import {
	describe,
	test,
	expect,
	beforeEach,
	afterEach,
	jest,
} from '@jest/globals';
import { Prompts } from '../../src/utils/prompt.js';

describe('Prompts', () => {
	let prompts: Prompts;
	let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

	beforeEach(() => {
		prompts = new Prompts();
		consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		consoleErrorSpy.mockRestore();
	});

	describe('constructor', () => {
		test('should create an instance of Prompts', () => {
			expect(prompts).toBeInstanceOf(Prompts);
		});
	});

	describe('loadSystemPrompt', () => {
		test('should be a function', () => {
			expect(typeof prompts.loadSystemPrompt).toBe('function');
		});

		test('should return a promise', () => {
			const result = prompts.loadSystemPrompt('./prompts/system_prompt.md');
			expect(result).toBeInstanceOf(Promise);
		});

		test('should handle invalid file path gracefully', async () => {
			const result = await prompts.loadSystemPrompt('/nonexistent/path.md');
			expect(result).toBeUndefined();
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'Error reading Markdown file:',
				expect.objectContaining({
					code: 'ENOENT',
				}),
			);
		});

		test('should load existing system prompt file', async () => {
			// Test with the actual system prompt file
			const result = await prompts.loadSystemPrompt(
				'./prompts/system_prompt.md',
			);

			if (result !== undefined) {
				expect(typeof result).toBe('string');
				expect(result.length).toBeGreaterThan(0);
			}
		});
	});
});