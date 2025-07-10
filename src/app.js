import { OllamaService } from './services/ollama.service.js';
import { CLIUtils } from './utils/cli.utils.js';
import { CONFIG } from './config/constants.js';

class ChatApplication {
	constructor() {
		this.ollamaService = new OllamaService();
		this.cliUtils = new CLIUtils();
	}

	async start() {
		this.cliUtils.log(CONFIG.MESSAGES.WELCOME);

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
			} catch (error) {
				this.cliUtils.log('Erro ao processar mensagem. Tente novamente.');
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
