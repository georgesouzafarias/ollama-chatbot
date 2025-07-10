export const CONFIG = {
	OLLAMA: {
		STREAM: true,
		MODEL: 'gemma3:1b',
		THINK: false,
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
