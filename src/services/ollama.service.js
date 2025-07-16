import ollama from 'ollama';
import { CONFIG } from '../config/constants.js';
import { Prompts } from '../utils/prompt.js';
import { CalculatorTools } from '../tools/calculatorTools.js';
import { PineconeStoreTools } from '../tools/pineconeTools.js';

export class OllamaService {
	constructor() {
		this.messagesContext = [];
		this.promptsService = new Prompts();
		this.calculatorTools = new CalculatorTools();
		this.pineconeStoreTools = new PineconeStoreTools();
		this.allTools = [
			...this.calculatorTools.getTools(),
			...this.pineconeStoreTools.getTools(),
		];
		this.availableFunctions = {
			...this.calculatorTools.availableFunctions,
			...this.pineconeStoreTools.availableFunctions,
		};
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

	async processMessage() {
		const response = await ollama.chat({
			model: CONFIG.OLLAMA.MODEL,
			messages: this.messagesContext,
			stream: CONFIG.OLLAMA.STREAM,
			think: CONFIG.OLLAMA.THINK,
			format: CONFIG.OLLAMA.FORMAT,
			tools: this.allTools,
			options: {
				temperature: CONFIG.OLLAMA.OPTIONS.TEMPERATURE,
				top_p: CONFIG.OLLAMA.OPTIONS.TOP_P,
				repeat_penalty: CONFIG.OLLAMA.OPTIONS.REPEAT_PENALTY,
			},
		});

		if (response.message.tool_calls) {
			this.messagesContext.push(response.message);
			const toolResults = await this.processToolCalls(
				response.message.tool_calls,
			);
			this.messagesContext.push(...toolResults);

			return await this.processMessage();
		}

		return response;
	}

	async sendMessage(message, role = 'user') {
		this.addMessage(role, message);

		try {
			const response = await this.processMessage();
			let assistantMessage = '';

			if (CONFIG.OLLAMA.THINK) {
				const thinking = response.message.thinking;
				const content = response.message.content;
				process.stdout.write('Thinking:\n========\n\n');
				process.stdout.write(thinking);
				process.stdout.write('\n\nResponse:\n========\n\n');
				assistantMessage += content;
				process.stdout.write(content);
				this.addMessage('assistant', assistantMessage);
			} else {
				const content = response.message.content;
				assistantMessage += content;
				process.stdout.write(content);
				this.addMessage('assistant', assistantMessage);
			}
		} catch (error) {
			console.error('\nError communicating with Ollama:', error.message);
			throw error;
		}
	}

	async sendMessageStream(message, role = 'user') {
		this.addMessage(role, message);

		try {
			const response = await this.processMessage();
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
			} else {
				for await (const part of response) {
					const content = part.message.content;
					process.stdout.write(content);
					assistantMessage += content;
				}
				this.addMessage('assistant', assistantMessage);
			}
		} catch (error) {
			console.error('\nError communicating with Ollama:', error.message);
			throw error;
		}
	}

	executeFunction(functionName, args) {
		const func = this.availableFunctions[functionName];

		if (!func) {
			throw new Error(`Function '${functionName}' not found`);
		}

		try {
			return func(args);
		} catch (error) {
			console.error(`Erro calling ${functionName}:`, error.message);
			throw error;
		}
	}

	async processToolCalls(toolCalls) {
		const results = [];
		for (const tool of toolCalls) {
			const functionName = tool.function.name;
			const args = tool.function.arguments;
			try {
				const result = this.executeFunction(functionName, args);
				results.push({
					role: 'tool',
					content: result.toString(),
				});
			} catch (error) {
				results.push({
					role: 'tool',
					content: `Erro: ${error.message}`,
				});
				console.error(`Erro: ${error.message}`);
			}
		}

		return results;
	}

	clearContext() {
		this.messagesContext = [];
	}

	getContext() {
		return [...this.messagesContext];
	}
}
