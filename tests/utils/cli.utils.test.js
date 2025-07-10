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
		cliUtils?.rl && cliUtils.close();
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
	});

	describe('question', () => {
		test('should have question method', () => {
			expect(typeof cliUtils.question).toBe('function');
		});
	});
});
