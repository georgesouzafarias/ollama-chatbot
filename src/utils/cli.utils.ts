import { createInterface, Interface } from 'readline/promises';
import { CONFIG } from '../config/constants.js';

export class CLIUtils {
	private rl: Interface;

	constructor() {
		process.stdin.setMaxListeners(20);
		process.stdout.setMaxListeners(20);
		process.setMaxListeners(20);

		this.rl = createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		this.setupSignalHandlers();
	}

	private setupSignalHandlers(): void {
		process.on('SIGINT', () => {
			console.log(CONFIG.MESSAGES.INTERRUPTED);
			this.close();
			process.exit(0);
		});
	}

	async question(prompt: string = CONFIG.MESSAGES.PROMPT): Promise<string> {
		return await this.rl.question(prompt);
	}

	isExitCommand(input: string): boolean {
		return CONFIG.EXIT_COMMANDS.includes(input.toLowerCase().trim());
	}

	close(): void {
		this.rl.close();
	}

	log(message: string, ...args: any[]): void {
		console.log(message, ...args);
	}

	newLine(): void {
		console.log();
	}
}
