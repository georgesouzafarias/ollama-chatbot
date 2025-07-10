import { jest } from '@jest/globals';
import { CLIUtils } from '../../src/utils/cli.utils.js';
import { CONFIG } from '../../src/config/constants.js';

// Mock readline/promises
const mockRl = {
	question: jest.fn(),
	close: jest.fn(),
};

jest.unstable_mockModule('readline/promises', () => ({
	createInterface: jest.fn(() => mockRl),
}));

describe('CLIUtils', () => {
	let cliUtils;
	let consoleSpy;
	let processExitSpy;

	beforeEach(() => {
		cliUtils = new CLIUtils();
		consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
		processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
		jest.clearAllMocks();
	});

	afterEach(() => {
		consoleSpy.mockRestore();
		processExitSpy.mockRestore();
	});

	describe('constructor', () => {
		test('should create readline interface', () => {
			expect(cliUtils.rl).toBeDefined();
		});

		test('should setup signal handlers', () => {
			expect(cliUtils.rl).toBe(mockRl);
		});
	});

	describe('question', () => {
		test('should call readline question with default prompt', async () => {
			const expectedAnswer = 'user input';
			mockRl.question.mockResolvedValue(expectedAnswer);

			const result = await cliUtils.question();

			expect(mockRl.question).toHaveBeenCalledWith(CONFIG.MESSAGES.PROMPT);
			expect(result).toBe(expectedAnswer);
		});

		test('should call readline question with custom prompt', async () => {
			const customPrompt = 'Custom prompt: ';
			const expectedAnswer = 'user input';
			mockRl.question.mockResolvedValue(expectedAnswer);

			const result = await cliUtils.question(customPrompt);

			expect(mockRl.question).toHaveBeenCalledWith(customPrompt);
			expect(result).toBe(expectedAnswer);
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
	});

	describe('close', () => {
		test('should close readline interface', () => {
			cliUtils.close();
			expect(mockRl.close).toHaveBeenCalled();
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

	describe('signal handlers', () => {
		test('should handle SIGINT signal', () => {
			// Trigger SIGINT
			process.emit('SIGINT');

			expect(consoleSpy).toHaveBeenCalledWith(CONFIG.MESSAGES.INTERRUPTED);
			expect(mockRl.close).toHaveBeenCalled();
			expect(processExitSpy).toHaveBeenCalledWith(0);
		});
	});
});
