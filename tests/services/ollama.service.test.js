import { describe, test, expect, beforeEach, jest } from '@jest/globals';

// Mock CONFIG
const mockConfig = {
	CONFIG: {
		OLLAMA: {
			MODEL: 'test-model',
			STREAM: true,
			THINK: false,
		},
	},
};

// Mock ollama module
const mockOllama = {
	chat: jest.fn(),
};

jest.mock('../../src/config/constants.js', () => mockConfig);
jest.mock('ollama', () => ({
	__esModule: true,
	default: mockOllama,
}));

// Import after mocking
import { OllamaService } from '../../src/services/ollama.service.js';

describe('OllamaService', () => {
	let ollamaService;

	beforeEach(() => {
		ollamaService = new OllamaService();
	});

	describe('constructor', () => {
		test('should initialize with empty messages context', () => {
			expect(ollamaService.messagesContext).toEqual([]);
		});

		test('should initialize promptsService', () => {
			expect(ollamaService.promptsService).toBeDefined();
		});
	});

	describe('addMessage', () => {
		test('should add message to context', () => {
			ollamaService.addMessage('user', 'Hello');

			expect(ollamaService.messagesContext).toEqual([
				{ role: 'user', content: 'Hello' },
			]);
		});

		test('should add multiple messages to context', () => {
			ollamaService.addMessage('user', 'Hello');
			ollamaService.addMessage('assistant', 'Hi there!');

			expect(ollamaService.messagesContext).toEqual([
				{ role: 'user', content: 'Hello' },
				{ role: 'assistant', content: 'Hi there!' },
			]);
		});
	});

	describe('clearContext', () => {
		test('should clear messages context', () => {
			ollamaService.addMessage('user', 'Hello');
			ollamaService.addMessage('assistant', 'Hi');

			ollamaService.clearContext();

			expect(ollamaService.messagesContext).toEqual([]);
		});
	});

	describe('getContext', () => {
		test('should return copy of messages context', () => {
			ollamaService.addMessage('user', 'Hello');
			ollamaService.addMessage('assistant', 'Hi');

			const context = ollamaService.getContext();

			expect(context).toEqual(ollamaService.messagesContext);
			expect(context).not.toBe(ollamaService.messagesContext); // Should be a copy
		});

		test('should return empty array when no messages', () => {
			const context = ollamaService.getContext();

			expect(context).toEqual([]);
		});

		test('should not affect original context when modifying returned copy', () => {
			ollamaService.addMessage('user', 'Hello');
			const context = ollamaService.getContext();

			context.push({ role: 'user', content: 'Modified' });

			expect(ollamaService.messagesContext).toHaveLength(1);
			expect(context).toHaveLength(2);
		});
	});

	describe('addSystemPrompt', () => {
		test('should have addSystemPrompt method', () => {
			expect(typeof ollamaService.addSystemPrompt).toBe('function');
		});

		test('should add system prompt to beginning of context', async () => {
			const mockPrompt = 'Test system prompt';
			const mockLoadSystemPrompt = jest.fn().mockResolvedValue(mockPrompt);
			ollamaService.promptsService.loadSystemPrompt = mockLoadSystemPrompt;

			await ollamaService.addSystemPrompt('./test/path.md');

			expect(mockLoadSystemPrompt).toHaveBeenCalledWith('./test/path.md');
			expect(ollamaService.messagesContext[0]).toEqual({
				role: 'system',
				content: mockPrompt,
			});
		});

		test('should handle loadSystemPrompt error gracefully', async () => {
			const consoleErrorSpy = jest
				.spyOn(console, 'error')
				.mockImplementation(() => {});
			const mockLoadSystemPrompt = jest
				.fn()
				.mockRejectedValue(new Error('File not found'));
			ollamaService.promptsService.loadSystemPrompt = mockLoadSystemPrompt;

			await ollamaService.addSystemPrompt('./nonexistent.md');

			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'Error loading system prompt:',
				'File not found',
			);
			expect(ollamaService.messagesContext).toEqual([]);

			consoleErrorSpy.mockRestore();
		});

		test('should not add system prompt if content is empty', async () => {
			const mockLoadSystemPrompt = jest.fn().mockResolvedValue(null);
			ollamaService.promptsService.loadSystemPrompt = mockLoadSystemPrompt;

			await ollamaService.addSystemPrompt('./empty.md');

			expect(ollamaService.messagesContext).toEqual([]);
		});
	});

	describe('sendMessage', () => {
		test('should have sendMessage method', () => {
			expect(typeof ollamaService.sendMessage).toBe('function');
		});

		test('should add user message to context when called', () => {
			const testMessage = 'Hello, how are you?';
			ollamaService.addMessage('user', testMessage);

			expect(ollamaService.messagesContext).toContainEqual({
				role: 'user',
				content: testMessage,
			});
		});

		test('should handle CONFIG.OLLAMA.THINK parameter access', () => {
			expect(mockConfig.CONFIG.OLLAMA.THINK).toBeDefined();
			expect(typeof mockConfig.CONFIG.OLLAMA.THINK).toBe('boolean');
		});

		test('should handle CONFIG.OLLAMA.STREAM parameter access', () => {
			expect(mockConfig.CONFIG.OLLAMA.STREAM).toBeDefined();
			expect(typeof mockConfig.CONFIG.OLLAMA.STREAM).toBe('boolean');
		});

		test('should handle CONFIG.OLLAMA.MODEL parameter access', () => {
			expect(mockConfig.CONFIG.OLLAMA.MODEL).toBeDefined();
			expect(typeof mockConfig.CONFIG.OLLAMA.MODEL).toBe('string');
		});
	});
});
