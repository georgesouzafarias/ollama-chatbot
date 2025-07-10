import { jest } from '@jest/globals';
import { OllamaService } from '../../src/services/ollama.service.js';
import { CONFIG } from '../../src/config/constants.js';

// Mock ollama module
const mockOllama = {
	chat: jest.fn(),
};

// Mock the entire ollama module
jest.unstable_mockModule('ollama', () => ({
	default: mockOllama,
}));

// Mock Prompts class
const mockPrompts = {
	loadSystemPrompt: jest.fn(),
};

jest.unstable_mockModule('../../src/utils/prompt.js', () => ({
	Prompts: jest.fn(() => mockPrompts),
}));

describe('OllamaService', () => {
	let ollamaService;
	let consoleSpy;

	beforeEach(() => {
		ollamaService = new OllamaService();
		consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
		jest.clearAllMocks();
	});

	afterEach(() => {
		consoleSpy.mockRestore();
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

	describe('addSystemPrompt', () => {
		test('should add system prompt to beginning of context when successful', async () => {
			const systemPrompt = 'You are a helpful assistant';
			mockPrompts.loadSystemPrompt.mockResolvedValue(systemPrompt);

			await ollamaService.addSystemPrompt('test/path');

			expect(mockPrompts.loadSystemPrompt).toHaveBeenCalledWith('test/path');
			expect(ollamaService.messagesContext).toEqual([
				{ role: 'system', content: systemPrompt },
			]);
		});

		test('should not add system prompt when loadSystemPrompt returns null', async () => {
			mockPrompts.loadSystemPrompt.mockResolvedValue(null);

			await ollamaService.addSystemPrompt('test/path');

			expect(ollamaService.messagesContext).toEqual([]);
		});

		test('should handle errors when loading system prompt', async () => {
			const error = new Error('File not found');
			mockPrompts.loadSystemPrompt.mockRejectedValue(error);

			await ollamaService.addSystemPrompt('test/path');

			expect(consoleSpy).toHaveBeenCalledWith(
				'Erro ao carregar system prompt:',
				'File not found',
			);
			expect(ollamaService.messagesContext).toEqual([]);
		});
	});

	describe('sendMessage', () => {
		test('should send message and return assistant response', async () => {
			const userMessage = 'Hello';
			const assistantResponse = 'Hi there!';

			const mockResponse = [
				{ message: { content: 'Hi ' } },
				{ message: { content: 'there!' } },
			];

			mockOllama.chat.mockReturnValue({
				[Symbol.asyncIterator]: async function* () {
					for (const part of mockResponse) {
						yield part;
					}
				},
			});

			// Mock process.stdout.write
			const stdoutSpy = jest
				.spyOn(process.stdout, 'write')
				.mockImplementation(() => {});
			const consoleSpy = jest
				.spyOn(console, 'log')
				.mockImplementation(() => {});

			const result = await ollamaService.sendMessage(userMessage);

			expect(ollamaService.messagesContext).toContainEqual({
				role: 'user',
				content: userMessage,
			});
			expect(ollamaService.messagesContext).toContainEqual({
				role: 'assistant',
				content: assistantResponse,
			});
			expect(result).toBe(assistantResponse);
			expect(mockOllama.chat).toHaveBeenCalledWith({
				model: CONFIG.OLLAMA.MODEL,
				messages: ollamaService.messagesContext,
				stream: CONFIG.OLLAMA.STREAM,
				think: CONFIG.OLLAMA.THINK,
			});

			stdoutSpy.mockRestore();
			consoleSpy.mockRestore();
		});

		test('should handle errors when communicating with Ollama', async () => {
			const error = new Error('Connection failed');
			mockOllama.chat.mockRejectedValue(error);

			const consoleSpy = jest
				.spyOn(console, 'error')
				.mockImplementation(() => {});

			await expect(ollamaService.sendMessage('Hello')).rejects.toThrow(
				'Connection failed',
			);
			expect(consoleSpy).toHaveBeenCalledWith(
				'\nErro ao comunicar com Ollama:',
				'Connection failed',
			);

			consoleSpy.mockRestore();
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
	});
});
