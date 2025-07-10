import { describe, test, expect } from '@jest/globals';
import { CONFIG } from '../../src/config/constants.js';

describe('CONFIG', () => {
	describe('OLLAMA configuration', () => {
		test('should have correct OLLAMA settings', () => {
			expect(CONFIG.OLLAMA).toBeDefined();
			expect(CONFIG.OLLAMA.STREAM).toBe(CONFIG.OLLAMA.STREAM);
			expect(CONFIG.OLLAMA.MODEL).toBe(CONFIG.OLLAMA.MODEL);
			expect(CONFIG.OLLAMA.THINK).toBe(CONFIG.OLLAMA.THINK);
		});

		test('should have valid model name format', () => {
			expect(typeof CONFIG.OLLAMA.MODEL).toBe('string');
			expect(CONFIG.OLLAMA.MODEL.length).toBeGreaterThan(0);
		});

		test('should have boolean values for stream and think', () => {
			expect(typeof CONFIG.OLLAMA.STREAM).toBe('boolean');
			expect(typeof CONFIG.OLLAMA.THINK).toBe('boolean');
		});
	});

	describe('EXIT_COMMANDS configuration', () => {
		test('should have exit commands array', () => {
			expect(Array.isArray(CONFIG.EXIT_COMMANDS)).toBe(true);
			expect(CONFIG.EXIT_COMMANDS.length).toBeGreaterThan(0);
		});

		test('should contain expected exit commands', () => {
			expect(CONFIG.EXIT_COMMANDS).toContain('sair');
			expect(CONFIG.EXIT_COMMANDS).toContain('exit');
			expect(CONFIG.EXIT_COMMANDS).toContain('quit');
		});

		test('should have all commands as strings', () => {
			CONFIG.EXIT_COMMANDS.forEach((command) => {
				expect(typeof command).toBe('string');
				expect(command.length).toBeGreaterThan(0);
			});
		});
	});

	describe('PROMPTS configuration', () => {
		test('should have prompts configuration', () => {
			expect(CONFIG.PROMPTS).toBeDefined();
			expect(CONFIG.PROMPTS.SYSTEM_PROMPT_PATH).toBeDefined();
		});

		test('should have valid system prompt path', () => {
			expect(typeof CONFIG.PROMPTS.SYSTEM_PROMPT_PATH).toBe('string');
			expect(CONFIG.PROMPTS.SYSTEM_PROMPT_PATH).toBe(
				'./prompts/system_prompt.md',
			);
		});
	});

	describe('MESSAGES configuration', () => {
		test('should have all required messages', () => {
			expect(CONFIG.MESSAGES).toBeDefined();
			expect(CONFIG.MESSAGES.WELCOME).toBeDefined();
			expect(CONFIG.MESSAGES.GOODBYE).toBeDefined();
			expect(CONFIG.MESSAGES.INTERRUPTED).toBeDefined();
			expect(CONFIG.MESSAGES.PROMPT).toBeDefined();
		});

		test('should have valid message strings', () => {
			expect(typeof CONFIG.MESSAGES.WELCOME).toBe('string');
			expect(typeof CONFIG.MESSAGES.GOODBYE).toBe('string');
			expect(typeof CONFIG.MESSAGES.INTERRUPTED).toBe('string');
			expect(typeof CONFIG.MESSAGES.PROMPT).toBe('string');
		});

		test('should have expected message content', () => {
			expect(CONFIG.MESSAGES.WELCOME).toBe(
				'Digite algo ou pressione Ctrl+C para sair',
			);
			expect(CONFIG.MESSAGES.GOODBYE).toBe('Até logo!');
			expect(CONFIG.MESSAGES.INTERRUPTED).toBe(
				'\nPrograma interrompido pelo usuário (Ctrl+C)',
			);
			expect(CONFIG.MESSAGES.PROMPT).toBe('> ');
		});

		test('should have non-empty messages', () => {
			Object.values(CONFIG.MESSAGES).forEach((message) => {
				expect(message.length).toBeGreaterThan(0);
			});
		});
	});

	describe('Configuration structure', () => {
		test('should have all required top-level properties', () => {
			expect(CONFIG).toHaveProperty('OLLAMA');
			expect(CONFIG).toHaveProperty('EXIT_COMMANDS');
			expect(CONFIG).toHaveProperty('PROMPTS');
			expect(CONFIG).toHaveProperty('MESSAGES');
		});

		test('should not have unexpected properties', () => {
			const expectedKeys = ['OLLAMA', 'EXIT_COMMANDS', 'PROMPTS', 'MESSAGES'];
			const actualKeys = Object.keys(CONFIG);

			expect(actualKeys).toEqual(expect.arrayContaining(expectedKeys));
			expect(actualKeys.length).toBe(expectedKeys.length);
		});
	});
});
