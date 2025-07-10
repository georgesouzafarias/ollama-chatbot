import { createInterface } from 'readline/promises';
import { CONFIG } from '../config/constants.js';

export class CLIUtils {
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

	setupSignalHandlers() {
		process.on('SIGINT', () => {
			console.log(CONFIG.MESSAGES.INTERRUPTED);
			this.close();
			process.exit(0);
		});
	}

	async question(prompt = CONFIG.MESSAGES.PROMPT) {
		return await this.rl.question(prompt);
	}

	isExitCommand(input) {
		return CONFIG.EXIT_COMMANDS.includes(input.toLowerCase().trim());
	}

	close() {
		this.rl.close();
	}

	log(message) {
		console.log(message);
	}

	newLine() {
		console.log();
	}
}
