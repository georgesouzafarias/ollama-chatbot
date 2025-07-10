import {
	describe,
	test,
	expect,
	beforeEach,
	afterEach,
	jest,
} from '@jest/globals';
import { CLIUtils } from '../../src/utils/cli.utils.js';
import { CONFIG } from '../../src/config/constants.js';

describe('CLIUtils', () => {
	let cliUtils;
	let consoleSpy;

	beforeEach(() => {
		cliUtils = new CLIUtils();
		consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
	});

	afterEach(() => {
		consoleSpy.mockRestore();
		if (cliUtils?.rl) {
			cliUtils.close();
		}
	});

	describe('constructor', () => {
		test('should create readline interface', () => {
			expect(cliUtils.rl).toBeDefined();
		});

		test('should create CLIUtils instance', () => {
			expect(cliUtils).toBeInstanceOf(CLIUtils);
		});
	});

	describe('isExitCommand', () => {
		test('should return true for exit commands', () => {
			CONFIG.EXIT_COMMANDS.forEach((command) => {
				expect(cliUtils.isExitCommand(command)).toBe(true);
				expect(cliUtils.isExitCommand(command.toUpperCase())).toBe(true);
				expect(cliUtils.isExitCommand(` ${command} `)).toBe(true);
			});
		});

		test('should return false for non-exit commands', () => {
			expect(cliUtils.isExitCommand('hello')).toBe(false);
			expect(cliUtils.isExitCommand('test')).toBe(false);
			expect(cliUtils.isExitCommand('')).toBe(false);
		});

		test('should handle mixed case variations', () => {
			expect(cliUtils.isExitCommand('EXIT')).toBe(true);
			expect(cliUtils.isExitCommand('Quit')).toBe(true);
			expect(cliUtils.isExitCommand('SAIR')).toBe(true);
		});

		test('should trim whitespace before checking', () => {
			expect(cliUtils.isExitCommand('  exit  ')).toBe(true);
			expect(cliUtils.isExitCommand('\tquit\n')).toBe(true);
		});
	});

	describe('log', () => {
		test('should log message to console', () => {
			const message = 'Test message';
			cliUtils.log(message);
			expect(consoleSpy).toHaveBeenCalledWith(message);
		});
	});

	describe('newLine', () => {
		test('should log empty line to console', () => {
			cliUtils.newLine();
			expect(consoleSpy).toHaveBeenCalledWith();
		});
	});

	describe('close', () => {
		test('should have close method', () => {
			expect(typeof cliUtils.close).toBe('function');
		});

		test('should close readline interface', () => {
			const mockClose = jest.fn();
			cliUtils.rl.close = mockClose;

			cliUtils.close();

			expect(mockClose).toHaveBeenCalled();
		});
	});

	describe('question', () => {
		test('should have question method', () => {
			expect(typeof cliUtils.question).toBe('function');
		});

		test('should use default prompt when none provided', async () => {
			const mockQuestion = jest.fn().mockResolvedValue('test input');
			cliUtils.rl.question = mockQuestion;

			await cliUtils.question();

			expect(mockQuestion).toHaveBeenCalledWith(CONFIG.MESSAGES.PROMPT);
		});

		test('should use custom prompt when provided', async () => {
			const mockQuestion = jest.fn().mockResolvedValue('test input');
			cliUtils.rl.question = mockQuestion;
			const customPrompt = 'Custom prompt: ';

			await cliUtils.question(customPrompt);

			expect(mockQuestion).toHaveBeenCalledWith(customPrompt);
		});
	});

	describe('setupSignalHandlers', () => {
		test('should setup SIGINT handler', () => {
			const mockOn = jest.spyOn(process, 'on');
			const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

			// Create new instance to test signal handler setup
			const testCLI = new CLIUtils();

			expect(mockOn).toHaveBeenCalledWith('SIGINT', expect.any(Function));

			// Clean up
			testCLI.close();
			mockOn.mockRestore();
			mockExit.mockRestore();
		});
	});
});
