import {
	describe,
	test,
	expect,
	beforeEach,
	afterEach,
	jest,
} from '@jest/globals';
import { ChatApplication } from '../src/app.js';
import { CONFIG } from '../src/config/constants.js';

describe('ChatApplication', () => {
	let chatApp;
	let consoleErrorSpy;

	beforeEach(() => {
		consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
		chatApp = new ChatApplication();
	});

	afterEach(() => {
		consoleErrorSpy.mockRestore();
		chatApp?.cleanup();
	});

	describe('constructor', () => {
		test('should initialize OllamaService and CLIUtils', () => {
			expect(chatApp.ollamaService).toBeDefined();
			expect(chatApp.cliUtils).toBeDefined();
			expect(chatApp.ollamaService.constructor.name).toBe('OllamaService');
			expect(chatApp.cliUtils.constructor.name).toBe('CLIUtils');
		});
	});

	describe('start', () => {
		test('should display welcome message and add system prompt', async () => {
			const mockQuestion = jest.fn().mockResolvedValue('exit');
			const mockIsExitCommand = jest.fn().mockReturnValue(true);
			const mockLog = jest.fn();
			const mockClose = jest.fn();
			const mockAddSystemPrompt = jest.fn().mockResolvedValue();

			chatApp.cliUtils.question = mockQuestion;
			chatApp.cliUtils.isExitCommand = mockIsExitCommand;
			chatApp.cliUtils.log = mockLog;
			chatApp.cliUtils.close = mockClose;
			chatApp.ollamaService.addSystemPrompt = mockAddSystemPrompt;

			await chatApp.start();

			expect(mockLog).toHaveBeenCalledWith(CONFIG.MESSAGES.WELCOME);
			expect(mockAddSystemPrompt).toHaveBeenCalledWith(
				CONFIG.PROMPTS.SYSTEM_PROMPT_PATH,
			);
		});

		test('should handle application errors gracefully', async () => {
			const testError = new Error('Test error');
			const mockQuestion = jest.fn().mockRejectedValue(testError);
			const mockClose = jest.fn();
			const mockLog = jest.fn();
			const mockAddSystemPrompt = jest.fn().mockResolvedValue();

			chatApp.cliUtils.question = mockQuestion;
			chatApp.cliUtils.close = mockClose;
			chatApp.cliUtils.log = mockLog;
			chatApp.ollamaService.addSystemPrompt = mockAddSystemPrompt;

			await chatApp.start();

			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'Application error:',
				testError.message,
			);
			expect(mockClose).toHaveBeenCalled();
		});

		test('should call cleanup on completion', async () => {
			const mockQuestion = jest.fn().mockResolvedValue('exit');
			const mockIsExitCommand = jest.fn().mockReturnValue(true);
			const mockLog = jest.fn();
			const mockClose = jest.fn();
			const mockAddSystemPrompt = jest.fn().mockResolvedValue();

			chatApp.cliUtils.question = mockQuestion;
			chatApp.cliUtils.isExitCommand = mockIsExitCommand;
			chatApp.cliUtils.log = mockLog;
			chatApp.cliUtils.close = mockClose;
			chatApp.ollamaService.addSystemPrompt = mockAddSystemPrompt;

			await chatApp.start();

			expect(mockClose).toHaveBeenCalled();
		});
	});

	describe('chatLoop', () => {
		test('should exit on exit command', async () => {
			const mockQuestion = jest.fn().mockResolvedValue('exit');
			const mockIsExitCommand = jest.fn().mockReturnValue(true);
			const mockLog = jest.fn();
			const mockSendMessage = jest.fn();

			chatApp.cliUtils.question = mockQuestion;
			chatApp.cliUtils.isExitCommand = mockIsExitCommand;
			chatApp.cliUtils.log = mockLog;
			chatApp.ollamaService.sendMessage = mockSendMessage;

			await chatApp.chatLoop();

			expect(mockLog).toHaveBeenCalledWith(CONFIG.MESSAGES.GOODBYE);
			expect(mockSendMessage).not.toHaveBeenCalled();
		});

		test('should skip empty input', async () => {
			const mockQuestion = jest
				.fn()
				.mockResolvedValueOnce('   ') // Empty input
				.mockResolvedValueOnce('exit'); // Exit command
			const mockIsExitCommand = jest
				.fn()
				.mockReturnValueOnce(false) // For empty input
				.mockReturnValueOnce(true); // For exit command
			const mockLog = jest.fn();
			const mockSendMessage = jest.fn();

			chatApp.cliUtils.question = mockQuestion;
			chatApp.cliUtils.isExitCommand = mockIsExitCommand;
			chatApp.cliUtils.log = mockLog;
			chatApp.ollamaService.sendMessage = mockSendMessage;

			await chatApp.chatLoop();

			expect(mockSendMessage).not.toHaveBeenCalled();
		});

		test('should process non-empty input', async () => {
			const testMessage = 'Hello, how are you?';
			const mockQuestion = jest
				.fn()
				.mockResolvedValueOnce(testMessage)
				.mockResolvedValueOnce('exit');
			const mockIsExitCommand = jest
				.fn()
				.mockReturnValueOnce(false)
				.mockReturnValueOnce(true);
			const mockLog = jest.fn();
			const mockSendMessage = jest.fn().mockResolvedValue('Response');
			const mockSendMessageStream = jest.fn().mockResolvedValue('Response');
			const mockNewLine = jest.fn();

			chatApp.cliUtils.question = mockQuestion;
			chatApp.cliUtils.isExitCommand = mockIsExitCommand;
			chatApp.cliUtils.log = mockLog;
			chatApp.cliUtils.newLine = mockNewLine;
			chatApp.ollamaService.sendMessage = mockSendMessage;
			chatApp.ollamaService.sendMessageStream = mockSendMessageStream;

			await chatApp.chatLoop();

			if (CONFIG.OLLAMA.STREAM) {
				expect(mockSendMessageStream).toHaveBeenCalledWith(testMessage);
			} else {
				expect(mockSendMessage).toHaveBeenCalledWith(testMessage);
			}
			expect(mockNewLine).toHaveBeenCalled();
		});

		test('should handle message processing errors', async () => {
			const testMessage = 'Hello';
			const testError = new Error('Network error');

			const mockQuestion = jest
				.fn()
				.mockResolvedValueOnce(testMessage)
				.mockResolvedValueOnce('exit');
			const mockIsExitCommand = jest
				.fn()
				.mockReturnValueOnce(false)
				.mockReturnValueOnce(true);
			const mockLog = jest.fn();
			const mockSendMessage = jest.fn().mockRejectedValue(testError);
			const mockSendMessageStream = jest.fn().mockRejectedValue(testError);

			chatApp.cliUtils.question = mockQuestion;
			chatApp.cliUtils.isExitCommand = mockIsExitCommand;
			chatApp.cliUtils.log = mockLog;
			chatApp.ollamaService.sendMessage = mockSendMessage;
			chatApp.ollamaService.sendMessageStream = mockSendMessageStream;

			await chatApp.chatLoop();

			expect(mockLog).toHaveBeenCalledWith(
				'Error processing message.',
				testError.message,
			);
		});
	});

	describe('cleanup', () => {
		test('should close CLI utils', () => {
			const mockClose = jest.fn();
			chatApp.cliUtils.close = mockClose;

			chatApp.cleanup();
			expect(mockClose).toHaveBeenCalled();
		});
	});
});
