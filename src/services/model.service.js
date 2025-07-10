import ollama from 'ollama';
import { CONFIG } from '../config/constants.js';

export class ModelService {
	async listInstalledModels() {
		try {
			return (await ollama.list()).models;
		} catch (err) {
			console.log('Error during the model list.', err.message);
		}
	}

	async isModelInstalled(modelName) {
		try {
			const listModel = await this.listInstalledModels();
			return listModel.some((model) => model.name === modelName);
		} catch (err) {
			console.log('Error during the model check.', err.message);
		}
	}

	async pullModelIfNeeded(modelName) {
		try {
			console.log(`The ${modelName} doesn't exist. Downloading ...`);
			const stream = await ollama.pull({
				model: modelName,
				insecure: false,
				stream: CONFIG.OLLAMA.STREAM,
			});

			for await (const part of stream) {
				if (part.digest) {
					let percent = 0;
					if (part.completed && part.total) {
						percent = Math.round((part.completed / part.total) * 100);
					}

					console.log();
					process.stdout.cursorTo(0);
					process.stdout.write(`${part.status} ${percent}%...`);
				} else {
					console.log(part.status);
				}
			}
		} catch (err) {
			console.log('Error during the model pulling.', err.message);
		}
	}
}
