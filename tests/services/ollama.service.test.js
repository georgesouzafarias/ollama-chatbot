import { describe, test, expect, beforeEach } from '@jest/globals';
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
	});

	describe('methods', () => {
		test('should have addSystemPrompt method', () => {
			expect(typeof ollamaService.addSystemPrompt).toBe('function');
		});

		test('should have sendMessage method', () => {
			expect(typeof ollamaService.sendMessage).toBe('function');
		});
	});
});
