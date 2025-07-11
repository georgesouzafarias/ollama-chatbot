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
			console.error('Error loading system prompt:', err.message);
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

			if (CONFIG.OLLAMA.THINK) {
				let startedThinking = false;
				let finishedThinking = false;

				for await (const part of response) {
					if (part.message.thinking && !startedThinking) {
						startedThinking = true;
						process.stdout.write('Thinking:\n========\n\n');
					} else if (
						part.message.content &&
						startedThinking &&
						!finishedThinking
					) {
						finishedThinking = true;
						process.stdout.write('\n\nResponse:\n========\n\n');
					}

					if (part.message.thinking) {
						process.stdout.write(part.message.thinking);
					} else if (part.message.content) {
						const content = part.message.content;
						process.stdout.write(content);
						assistantMessage += content;
					}
				}
				this.addMessage('assistant', assistantMessage);
				return assistantMessage;
			} else {
				for await (const part of response) {
					const content = part.message.content;
					process.stdout.write(content);
					assistantMessage += content;
					this.addMessage('assistant', assistantMessage);
				}
				this.addMessage('assistant', assistantMessage);
				return assistantMessage;
			}
		} catch (error) {
			console.error('\nError communicating with Ollama:', error.message);
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
