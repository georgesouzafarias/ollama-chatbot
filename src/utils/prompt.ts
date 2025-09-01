import { readFile } from 'node:fs/promises';

export class Prompts {
	async loadSystemPrompt(filePath: string): Promise<string | undefined> {
		try {
			return await readFile(filePath, { encoding: 'utf-8' });
		} catch (err: any) {
			console.error('Error reading Markdown file:', err);
		}
	}
}