import ollama from 'ollama';
import { CONFIG } from '../config/constants.js';

export class OllamaService {
	constructor() {
		this.messagesContext = [];
	}

	addMessage(role, content) {
		this.messagesContext.push({ role, content });
	}

	async sendMessage(message) {
		this.addMessage('user', message);

		try {
			const response = await ollama.chat({
				model: CONFIG.MODEL,
				messages: this.messagesContext,
				stream: true,
			});

			let assistantMessage = '';
			for await (const part of response) {
				const content = part.message.content;
				process.stdout.write(content);
				assistantMessage += content;
			}

			this.addMessage('assistant', assistantMessage);
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
