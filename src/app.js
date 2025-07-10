import { OllamaService } from './services/ollama.service.js';
import { ModelService } from './services/model.service.js';
import { CLIUtils } from './utils/cli.utils.js';
import { CONFIG } from './config/constants.js';

export class ChatApplication {
	constructor() {
		this.ollamaService = new OllamaService();
		this.cliUtils = new CLIUtils();
		this.modelService = new ModelService();
	}

	async start() {
		this.cliUtils.log(CONFIG.MESSAGES.WELCOME);
		if (!(await this.modelService.isModelInstalled(CONFIG.OLLAMA.MODEL))) {
			await this.modelService.pullModelIfNeeded(CONFIG.OLLAMA.MODEL);
		}
		await this.ollamaService.addSystemPrompt(CONFIG.PROMPTS.SYSTEM_PROMPT_PATH);

		try {
			await this.chatLoop();
		} catch (error) {
			console.error('Erro na aplicação:', error.message);
		} finally {
			this.cleanup();
		}
	}

	async chatLoop() {
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
				await this.ollamaService.sendMessage(input);
				this.cliUtils.newLine();
			} catch (err) {
				this.cliUtils.log('Erro ao processar mensagem.', err.message);
			}
		}
	}

	cleanup() {
		this.cliUtils.close();
	}
}

// Inicializar aplicação
const app = new ChatApplication();
app.start().catch(console.error);
