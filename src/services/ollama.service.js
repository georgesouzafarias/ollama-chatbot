import ollama from 'ollama';
import { CONFIG } from '../config/constants.js';
import { Prompts } from '../utils/prompt.js';

export class OllamaService {
	constructor() {
		this.messagesContext = [];
		this.promptsService = new Prompts();
	}

	addMessage(role, content) {
		this.messagesContext.push({ role, content });
	}

	async addSystemPrompt(filePath) {
		try {
			const systemPrompt = await this.promptsService.loadSystemPrompt(filePath);
			if (systemPrompt) {
				this.messagesContext.unshift({ role: 'system', content: systemPrompt });
			}
		} catch (err) {
			console.error('Erro ao carregar system prompt:', err.message);
		}
	}

	async sendMessage(message) {
		this.addMessage('user', message);

		try {
			const response = await ollama.chat({
				model: CONFIG.OLLAMA.MODEL,
				messages: this.messagesContext,
				stream: CONFIG.OLLAMA.STREAM,
				think: CONFIG.OLLAMA.THINK,
			});

			let assistantMessage = '';
			for await (const part of response) {
				const content = part.message.content;
				process.stdout.write(content);
				assistantMessage += content;
			}

			this.addMessage('assistant', assistantMessage);

			console.log(this.messagesContext);

			return assistantMessage;
		} catch (error) {
			console.error('\nErro ao comunicar com Ollama:', error.message);
			throw error;
		}
	}

	clearContext() {
		this.messagesContext = [];
	}

	getContext() {
		return [...this.messagesContext];
	}
}
