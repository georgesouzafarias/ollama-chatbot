export const CONFIG = {
	OLLAMA: {
		STREAM: true,
		MODEL: 'deepseek-r1:1.5b',
		THINK: true,
	},
	EXIT_COMMANDS: ['sair', 'exit', 'quit'],
	PROMPTS: {
		SYSTEM_PROMPT_PATH: './prompts/system_prompt.md',
	},
	MESSAGES: {
		WELCOME: 'Type something or press Ctrl+C to exit',
		GOODBYE: 'See you later!',
		INTERRUPTED: '\nProgram interrupted by user (Ctrl+C)',
		PROMPT: '> ',
	},
};
