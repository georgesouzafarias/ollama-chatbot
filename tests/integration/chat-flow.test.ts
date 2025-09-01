import {
	describe,
	test,
	expect,
	beforeEach,
	afterEach,
	jest,
} from '@jest/globals';
import { ChatApplication } from '../../src/app.js';
import { CONFIG } from '../../src/config/constants.js';

describe('Chat Flow Integration Tests', () => {
	let chatApp: ChatApplication;
	let originalProcessExit: typeof process.exit;
	let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;
	let consoleLogSpy: jest.SpiedFunction<typeof console.log>;

	beforeEach(() => {
		// Mock process.exit to prevent actual exit during tests
		originalProcessExit = process.exit;
		process.exit = jest.fn() as any;

		consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
		consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

		chatApp = new ChatApplication();
	});

	afterEach(async () => {
		process.exit = originalProcessExit;
		consoleErrorSpy.mockRestore();
		consoleLogSpy.mockRestore();
		(chatApp as any)?.cleanup();
	});

	describe('System Prompt Integration', () => {
		test('should load and use system prompt correctly', async () => {
			// Mock CLIUtils to immediately exit after setup
			const mockQuestion = jest.fn().mockResolvedValue('exit');
			const mockIsExitCommand = jest.fn().mockReturnValue(true);
			const mockLog = jest.fn();
			const mockClose = jest.fn();
			const mockNewLine = jest.fn();
			const mockIsModelInstalled = jest.fn().mockResolvedValue(true);

			(chatApp as any).cliUtils.question = mockQuestion;
			(chatApp as any).cliUtils.isExitCommand = mockIsExitCommand;
			(chatApp as any).cliUtils.log = mockLog;
			(chatApp as any).cliUtils.close = mockClose;
			(chatApp as any).cliUtils.newLine = mockNewLine;
			(chatApp as any).modelService.isModelInstalled = mockIsModelInstalled;

			await chatApp.start();

			// Verify system prompt was loaded
			expect((chatApp as any).ollamaService.messagesContext).toHaveLength(1);
			expect((chatApp as any).ollamaService.messagesContext[0].role).toBe('system');
			expect((chatApp as any).ollamaService.messagesContext[0].content).toBeTruthy();
		});
	});

	describe('Error Handling Integration', () => {
		test('should handle system prompt loading errors gracefully', async () => {
			// Mock system prompt to fail
			const mockLoadSystemPrompt = jest
				.fn()
				.mockRejectedValue(new Error('File not found'));
			(chatApp as any).ollamaService.promptsService.loadSystemPrompt =
				mockLoadSystemPrompt;

			const mockQuestion = jest.fn().mockResolvedValue('exit');
			const mockIsExitCommand = jest.fn().mockReturnValue(true);
			const mockLog = jest.fn();
			const mockClose = jest.fn();
			const mockNewLine = jest.fn();
			const mockIsModelInstalled = jest.fn().mockResolvedValue(true);

			(chatApp as any).cliUtils.question = mockQuestion;
			(chatApp as any).cliUtils.isExitCommand = mockIsExitCommand;
			(chatApp as any).cliUtils.log = mockLog;
			(chatApp as any).cliUtils.close = mockClose;
			(chatApp as any).cliUtils.newLine = mockNewLine;
			(chatApp as any).modelService.isModelInstalled = mockIsModelInstalled;

			await chatApp.start();

			// Should continue without system prompt
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				'Error loading system prompt:',
				'File not found',
			);
			expect(mockLog).toHaveBeenCalledWith(CONFIG.MESSAGES.WELCOME);
		});

		test('should handle message sending errors gracefully', async () => {
			const messages = ['Hello', 'exit'];
			let callCount = 0;

			const mockQuestion = jest.fn().mockImplementation(() => {
				return Promise.resolve(messages[callCount++]);
			});

			const mockIsExitCommand = jest.fn().mockImplementation((input: string) => {
				return input === 'exit';
			});

			const mockSendMessage = jest
				.fn()
				.mockRejectedValue(new Error('API Error'));
			const mockLog = jest.fn();
			const mockClose = jest.fn();
			const mockNewLine = jest.fn();
			const mockIsModelInstalled = jest.fn().mockResolvedValue(true);

			(chatApp as any).cliUtils.question = mockQuestion;
			(chatApp as any).cliUtils.isExitCommand = mockIsExitCommand;
			(chatApp as any).cliUtils.log = mockLog;
			(chatApp as any).cliUtils.close = mockClose;
			(chatApp as any).cliUtils.newLine = mockNewLine;
			(chatApp as any).ollamaService.sendMessage = mockSendMessage;
			(chatApp as any).modelService.isModelInstalled = mockIsModelInstalled;

			await chatApp.start();

			// Should log error and continue
			expect(mockLog).toHaveBeenCalledWith('See you later!');
			expect(mockLog).toHaveBeenCalledWith(CONFIG.MESSAGES.GOODBYE);
		});
	});

	describe('Configuration Validation', () => {
		test('should use configured exit commands', () => {
			CONFIG.EXIT_COMMANDS.forEach((command) => {
				expect((chatApp as any).cliUtils.isExitCommand(command)).toBe(true);
				expect((chatApp as any).cliUtils.isExitCommand(command.toUpperCase())).toBe(
					true,
				);
			});
		});

		test('should use configured messages', async () => {
			const mockQuestion = jest.fn().mockResolvedValue('exit');
			const mockIsExitCommand = jest.fn().mockReturnValue(true);
			const mockLog = jest.fn();
			const mockClose = jest.fn();
			const mockNewLine = jest.fn();
			const mockIsModelInstalled = jest.fn().mockResolvedValue(true);

			(chatApp as any).cliUtils.question = mockQuestion;
			(chatApp as any).cliUtils.isExitCommand = mockIsExitCommand;
			(chatApp as any).cliUtils.log = mockLog;
			(chatApp as any).cliUtils.close = mockClose;
			(chatApp as any).cliUtils.newLine = mockNewLine;
			(chatApp as any).modelService.isModelInstalled = mockIsModelInstalled;

			await chatApp.start();

			expect(mockLog).toHaveBeenCalledWith(CONFIG.MESSAGES.WELCOME);
			expect(mockLog).toHaveBeenCalledWith(CONFIG.MESSAGES.GOODBYE);
		});
	});
});