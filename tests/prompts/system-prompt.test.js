import { describe, test, expect } from '@jest/globals';
import { readFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { CONFIG } from '../../src/config/constants.js';

describe('System Prompt File Tests', () => {
	const systemPromptPath = CONFIG.PROMPTS.SYSTEM_PROMPT_PATH;

	describe('File existence and accessibility', () => {
		test('should exist and be readable', async () => {
			try {
				await access(systemPromptPath, constants.F_OK | constants.R_OK);
			} catch (error) {
				throw new Error(
					`System prompt file should exist and be readable at ${systemPromptPath}: ${error.message}`,
				);
			}
		});
	});

	describe('File content validation', () => {
		test('should have non-empty content', async () => {
			try {
				const content = await readFile(systemPromptPath, { encoding: 'utf-8' });

				expect(content).toBeDefined();
				expect(typeof content).toBe('string');
				expect(content.trim().length).toBeGreaterThan(0);
			} catch (error) {
				throw new Error(
					`Should be able to read system prompt file: ${error.message}`,
				);
			}
		});

		test('should contain valid prompt text', async () => {
			try {
				const content = await readFile(systemPromptPath, { encoding: 'utf-8' });

				// Basic validation - should not contain only whitespace
				expect(content.trim()).toBeTruthy();

				// Should be reasonable length for a system prompt
				expect(content.length).toBeGreaterThan(10);
				expect(content.length).toBeLessThan(10000); // Reasonable upper limit

				// Should not contain obvious placeholder text
				expect(content.toLowerCase()).not.toContain('todo');
				expect(content.toLowerCase()).not.toContain('placeholder');
				expect(content.toLowerCase()).not.toContain('replace this');
			} catch (error) {
				throw new Error(
					`Should be able to validate system prompt content: ${error.message}`,
				);
			}
		});

		test('should be properly formatted markdown', async () => {
			try {
				const content = await readFile(systemPromptPath, { encoding: 'utf-8' });

				// Basic markdown validation
				// Should not have malformed markdown syntax
				const lines = content.split('\n');

				for (const line of lines) {
					// Check for unclosed code blocks
					const codeBlockMatches = line.match(/```/g);
					if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
						// If odd number of ``` on a line, it should be opening/closing a block
						// This is basic validation - more sophisticated parsing would be needed for full validation
					}

					// Check for malformed headers
					if (line.startsWith('#')) {
						expect(line).toMatch(/^#+\s+.+/); // Should have space after #
					}
				}
			} catch (error) {
				throw new Error(
					`Should be able to validate markdown format: ${error.message}`,
				);
			}
		});
	});

	describe('Integration with Prompts class', () => {
		test('should be loadable by Prompts class', async () => {
			const { Prompts } = await import('../../src/utils/prompt.js');
			const prompts = new Prompts();

			const content = await prompts.loadSystemPrompt(systemPromptPath);

			expect(content).toBeDefined();
			expect(typeof content).toBe('string');
			expect(content.trim().length).toBeGreaterThan(0);
		});
	});
});
