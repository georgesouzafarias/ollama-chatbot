import { readFile } from 'node:fs/promises';
import { CONFIG } from '../config/constants.js';

export class Prompts {
	async loadSystemPrompt(filePath) {
		try {
			return await readFile(filePath, { encoding: 'utf-8' });
		} catch (err) {
			console.error('Error reading Markdown file:', err);
		}
	}
}
