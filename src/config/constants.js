export const CONFIG = {
	OLLAMA: {
		STREAM: false,
		MODEL: 'llama3.1:latest',
		THINK: false,
		//BUG: for some reason, the ollama package only supporting the 'json' format
		FORMAT: null,
		OPTIONS: {
			TEMPERATURE: 0.8,
			TOP_P: 0.9,
			REPEAT_PENALTY: 1.1,
		},
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
