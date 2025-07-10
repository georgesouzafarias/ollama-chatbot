import { jest } from '@jest/globals';
import { Prompts } from '../../src/utils/prompt.js';

// Mock node:fs/promises
const mockReadFile = jest.fn();

jest.unstable_mockModule('node:fs/promises', () => ({
	readFile: mockReadFile,
}));

describe('Prompts', () => {
	let prompts;
	let consoleSpy;

	beforeEach(() => {
		prompts = new Prompts();
		consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
		jest.clearAllMocks();
	});

	afterEach(() => {
		consoleSpy.mockRestore();
	});

	describe('loadSystemPrompt', () => {
		test('should load system prompt from file successfully', async () => {
			const expectedContent = 'You are a helpful assistant.';
			const filePath = '/path/to/system_prompt.md';

			mockReadFile.mockResolvedValue(expectedContent);

			const result = await prompts.loadSystemPrompt(filePath);

			expect(mockReadFile).toHaveBeenCalledWith(filePath, {
				encoding: 'utf-8',
			});
			expect(result).toBe(expectedContent);
		});

		test('should handle file read errors', async () => {
			const filePath = '/path/to/nonexistent.md';
			const error = new Error('ENOENT: no such file or directory');

			mockReadFile.mockRejectedValue(error);

			const result = await prompts.loadSystemPrompt(filePath);

			expect(mockReadFile).toHaveBeenCalledWith(filePath, {
				encoding: 'utf-8',
			});
			expect(consoleSpy).toHaveBeenCalledWith(
				'Error reading Markdown file:',
				error,
			);
			expect(result).toBeUndefined();
		});

		test('should handle empty file', async () => {
			const filePath = '/path/to/empty.md';

			mockReadFile.mockResolvedValue('');

			const result = await prompts.loadSystemPrompt(filePath);

			expect(result).toBe('');
		});

		test('should handle file with multiline content', async () => {
			const expectedContent = `You are a helpful assistant.
You should be polite and professional.
Always provide accurate information.`;
			const filePath = '/path/to/system_prompt.md';

			mockReadFile.mockResolvedValue(expectedContent);

			const result = await prompts.loadSystemPrompt(filePath);

			expect(result).toBe(expectedContent);
		});
	});
});
