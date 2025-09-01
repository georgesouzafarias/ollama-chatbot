import { OllamaService } from './services/ollama.service.js';
import { ModelService } from './services/model.service.js';
import { CLIUtils } from './utils/cli.utils.js';
import { CONFIG } from './config/constants.js';

export class ChatApplication {
	private ollamaService: OllamaService;
	private cliUtils: CLIUtils;
	private modelService: ModelService;

	constructor() {
		this.ollamaService = new OllamaService();
		this.cliUtils = new CLIUtils();
		this.modelService = new ModelService();
	}

	async start(): Promise<void> {
		this.cliUtils.log(CONFIG.MESSAGES.WELCOME);
		if (!(await this.modelService.isModelInstalled(CONFIG.OLLAMA.MODEL))) {
			await this.modelService.pullModelIfNeeded(CONFIG.OLLAMA.MODEL);
		}
		await this.ollamaService.addSystemPrompt(CONFIG.PROMPTS.SYSTEM_PROMPT_PATH);

		try {
			await this.chatLoop();
		} catch (error: any) {
			console.error('Application error:', error.message);
		} finally {
			this.cleanup();
		}
	}

	private async chatLoop(): Promise<void> {
		while (true) {
			const input = await this.cliUtils.question();

			if (this.cliUtils.isExitCommand(input)) {
				this.cliUtils.log(CONFIG.MESSAGES.GOODBYE);
				break;
			}

			if (input.trim() === '') {
				continue;
			}

			try {
				if (CONFIG.OLLAMA.STREAM) {
					await this.ollamaService.sendMessageStream(input);
				} else {
					await this.ollamaService.sendMessage(input);
				}

				this.cliUtils.newLine();
			} catch (err: any) {
				this.cliUtils.log('Error processing message.', err.message);
			}
		}
	}

	private cleanup(): void {
		this.cliUtils.close();
	}
}

// Initialize application
const app = new ChatApplication();
app.start().catch(console.error);