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
	let chatApp: ChatApplication;
	let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

	beforeEach(() => {
		consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
		chatApp = new ChatApplication();
	});

	afterEach(() => {
		consoleErrorSpy.mockRestore();
		(chatApp as any)?.cleanup();
	});

	describe('constructor', () => {
		test('should initialize OllamaService and CLIUtils', () => {
			expect((chatApp as any).ollamaService).toBeDefined();
			expect((chatApp as any).cliUtils).toBeDefined();
			expect((chatApp as any).ollamaService.constructor.name).toBe('OllamaService');
			expect((chatApp as any).cliUtils.constructor.name).toBe('CLIUtils');
		});
	});

	describe('start', () => {
		test('should display welcome message and add system prompt', async () => {
			const mockQuestion = jest.fn().mockResolvedValue('exit');
			const mockIsExitCommand = jest.fn().mockReturnValue(true);
			const mockLog = jest.fn();
			const mockClose = jest.fn();
			const mockAddSystemPrompt = jest.fn().mockResolvedValue(undefined);
			const mockIsModelInstalled = jest.fn().mockResolvedValue(true);

			(chatApp as any).cliUtils.question = mockQuestion;
			(chatApp as any).cliUtils.isExitCommand = mockIsExitCommand;
			(chatApp as any).cliUtils.log = mockLog;
			(chatApp as any).cliUtils.close = mockClose;
			(chatApp as any).ollamaService.addSystemPrompt = mockAddSystemPrompt;
			(chatApp as any).modelService.isModelInstalled = mockIsModelInstalled;

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
			const mockAddSystemPrompt = jest.fn().mockResolvedValue(undefined);
			const mockIsModelInstalled = jest.fn().mockResolvedValue(true);

			(chatApp as any).cliUtils.question = mockQuestion;
			(chatApp as any).cliUtils.close = mockClose;
			(chatApp as any).cliUtils.log = mockLog;
			(chatApp as any).ollamaService.addSystemPrompt = mockAddSystemPrompt;
			(chatApp as any).modelService.isModelInstalled = mockIsModelInstalled;

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
			const mockAddSystemPrompt = jest.fn().mockResolvedValue(undefined);
			const mockIsModelInstalled = jest.fn().mockResolvedValue(true);

			(chatApp as any).cliUtils.question = mockQuestion;
			(chatApp as any).cliUtils.isExitCommand = mockIsExitCommand;
			(chatApp as any).cliUtils.log = mockLog;
			(chatApp as any).cliUtils.close = mockClose;
			(chatApp as any).ollamaService.addSystemPrompt = mockAddSystemPrompt;
			(chatApp as any).modelService.isModelInstalled = mockIsModelInstalled;

			await chatApp.start();

			expect(mockClose).toHaveBeenCalled();
		});
	});

	describe('cleanup', () => {
		test('should close CLI utils', () => {
			const mockClose = jest.fn();
			(chatApp as any).cliUtils.close = mockClose;

			(chatApp as any).cleanup();
			expect(mockClose).toHaveBeenCalled();
		});
	});
});