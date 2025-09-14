import ollama, { ListResponse } from 'ollama';
import { CONFIG } from '../config/constants.js';
import { logger } from '../decorators/logging.decorator.js';

export class ModelService {
	async listInstalledModels(): Promise<ListResponse['models'] | undefined> {
		try {
			return (await ollama.list()).models;
		} catch (err: any) {
			console.log('Error during the model list.', err.message);
		}
	}

	@logger
	async isModelInstalled(modelName: string): Promise<boolean | undefined> {
		try {
			const listModel = await this.listInstalledModels();
			return listModel?.some((model) => model.name === modelName);
		} catch (err: any) {
			console.log('Error during the model check.', err.message);
		}
	}

	async pullModelIfNeeded(modelName: string): Promise<void> {
		try {
			console.log(`The ${modelName} doesn't exist. Downloading ...`);

			if (CONFIG.OLLAMA.STREAM) {
				const stream = await ollama.pull({
					model: modelName,
					insecure: false,
					stream: true,
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
			} else {
				ollama.pull({
					model: modelName,
					insecure: false,
					stream: false,
				});
				console.log('Model downloaded successfully');
			}
		} catch (err: any) {
			console.log('Error during the model pulling.', err.message);
		}
	}
}
