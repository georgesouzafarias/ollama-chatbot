import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { ChatApplication } from '../../src/app.js';
import { OllamaService } from '../../src/services/ollama.service.js';
import { CLIUtils } from '../../src/utils/cli.utils.js';
import { Prompts } from '../../src/utils/prompt.js';
import { CONFIG } from '../../src/config/constants.js';

describe('Chat Flow Integration Tests', () => {
	let chatApp;
	let originalProcessExit;
	let consoleErrorSpy;
	let consoleLogSpy;

	beforeEach(() => {
		// Mock process.exit to prevent actual exit during tests
		originalProcessExit = process.exit;
		process.exit = jest.fn();
		
		consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
		consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
		
		chatApp = new ChatApplication();
	});

	afterEach(() => {
		process.exit = originalProcessExit;
		consoleErrorSpy.mockRestore();
		consoleLogSpy.mockRestore();
		chatApp?.cleanup();
	});

	describe('System Prompt Integration', () => {
		test('should load and use system prompt correctly', async () => {
			// Mock CLIUtils to immediately exit after setup
			const mockQuestion = jest.fn().mockResolvedValue('exit');
			const mockIsExitCommand = jest.fn().mockReturnValue(true);
			const mockLog = jest.fn();
			const mockClose = jest.fn();
			const mockNewLine = jest.fn();

			chatApp.cliUtils.question = mockQuestion;
			chatApp.cliUtils.isExitCommand = mockIsExitCommand;
			chatApp.cliUtils.log = mockLog;
			chatApp.cliUtils.close = mockClose;
			chatApp.cliUtils.newLine = mockNewLine;

			await chatApp.start();

			// Verify system prompt was loaded
			expect(chatApp.ollamaService.messagesContext).toHaveLength(1);
			expect(chatApp.ollamaService.messagesContext[0].role).toBe('system');
			expect(chatApp.ollamaService.messagesContext[0].content).toBeTruthy();
		});
	});

	describe('Message Context Management', () => {
		test('should maintain conversation context across multiple messages', async () => {
			const messages = ['Hello', 'How are you?', 'exit'];
			let callCount = 0;

			const mockQuestion = jest.fn().mockImplementation(() => {
				return Promise.resolve(messages[callCount++]);
			});
			
			const mockIsExitCommand = jest.fn().mockImplementation((input) => {
				return input === 'exit';
			});

			const mockSendMessage = jest.fn().mockImplementation(async (message) => {
				// Simulate what the real sendMessage does
				chatApp.ollamaService.addMessage('user', message);
				const response = 'Mock response';
				chatApp.ollamaService.addMessage('assistant', response);
				return response;
			});

			const mockLog = jest.fn();
			const mockClose = jest.fn();
			const mockNewLine = jest.fn();

			chatApp.cliUtils.question = mockQuestion;
			chatApp.cliUtils.isExitCommand = mockIsExitCommand;
			chatApp.cliUtils.log = mockLog;
			chatApp.cliUtils.close = mockClose;
			chatApp.cliUtils.newLine = mockNewLine;
			chatApp.ollamaService.sendMessage = mockSendMessage;

			await chatApp.start();

			// Should have system prompt + 2 user messages + 2 assistant responses
			expect(chatApp.ollamaService.messagesContext).toHaveLength(5);
			
			// Check message order and content
			expect(chatApp.ollamaService.messagesContext[0].role).toBe('system');
			expect(chatApp.ollamaService.messagesContext[1].role).toBe('user');
			expect(chatApp.ollamaService.messagesContext[1].content).toBe('Hello');
			expect(chatApp.ollamaService.messagesContext[2].role).toBe('assistant');
			expect(chatApp.ollamaService.messagesContext[3].role).toBe('user');
			expect(chatApp.ollamaService.messagesContext[3].content).toBe('How are you?');
			expect(chatApp.ollamaService.messagesContext[4].role).toBe('assistant');
		});
	});

	describe('Error Handling Integration', () => {
		test('should handle system prompt loading errors gracefully', async () => {
			// Mock system prompt to fail
			const mockLoadSystemPrompt = jest.fn().mockRejectedValue(new Error('File not found'));
			chatApp.ollamaService.promptsService.loadSystemPrompt = mockLoadSystemPrompt;

			const mockQuestion = jest.fn().mockResolvedValue('exit');
			const mockIsExitCommand = jest.fn().mockReturnValue(true);
			const mockLog = jest.fn();
			const mockClose = jest.fn();
			const mockNewLine = jest.fn();

			chatApp.cliUtils.question = mockQuestion;
			chatApp.cliUtils.isExitCommand = mockIsExitCommand;
			chatApp.cliUtils.log = mockLog;
			chatApp.cliUtils.close = mockClose;
			chatApp.cliUtils.newLine = mockNewLine;

			await chatApp.start();

			// Should continue without system prompt
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'Erro ao carregar system prompt:',
				'File not found'
			);
			expect(mockLog).toHaveBeenCalledWith(CONFIG.MESSAGES.WELCOME);
		});

		test('should handle message sending errors gracefully', async () => {
			const messages = ['Hello', 'exit'];
			let callCount = 0;

			const mockQuestion = jest.fn().mockImplementation(() => {
				return Promise.resolve(messages[callCount++]);
			});
			
			const mockIsExitCommand = jest.fn().mockImplementation((input) => {
				return input === 'exit';
			});

			const mockSendMessage = jest.fn().mockRejectedValue(new Error('API Error'));
			const mockLog = jest.fn();
			const mockClose = jest.fn();
			const mockNewLine = jest.fn();

			chatApp.cliUtils.question = mockQuestion;
			chatApp.cliUtils.isExitCommand = mockIsExitCommand;
			chatApp.cliUtils.log = mockLog;
			chatApp.cliUtils.close = mockClose;
			chatApp.cliUtils.newLine = mockNewLine;
			chatApp.ollamaService.sendMessage = mockSendMessage;

			await chatApp.start();

			// Should log error and continue
			expect(mockLog).toHaveBeenCalledWith(
				'Erro ao processar mensagem.',
				'API Error'
			);
			expect(mockLog).toHaveBeenCalledWith(CONFIG.MESSAGES.GOODBYE);
		});
	});

	describe('Configuration Validation', () => {
		test('should use configured exit commands', () => {
			CONFIG.EXIT_COMMANDS.forEach(command => {
				expect(chatApp.cliUtils.isExitCommand(command)).toBe(true);
				expect(chatApp.cliUtils.isExitCommand(command.toUpperCase())).toBe(true);
			});
		});

		test('should use configured messages', async () => {
			const mockQuestion = jest.fn().mockResolvedValue('exit');
			const mockIsExitCommand = jest.fn().mockReturnValue(true);
			const mockLog = jest.fn();
			const mockClose = jest.fn();
			const mockNewLine = jest.fn();

			chatApp.cliUtils.question = mockQuestion;
			chatApp.cliUtils.isExitCommand = mockIsExitCommand;
			chatApp.cliUtils.log = mockLog;
			chatApp.cliUtils.close = mockClose;
			chatApp.cliUtils.newLine = mockNewLine;

			await chatApp.start();

			expect(mockLog).toHaveBeenCalledWith(CONFIG.MESSAGES.WELCOME);
			expect(mockLog).toHaveBeenCalledWith(CONFIG.MESSAGES.GOODBYE);
		});
	});
});