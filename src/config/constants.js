export const CONFIG = {
	OLLAMA: {
		STREAM: false, //Stream is not working with tools so far.
		MODEL: 'llama3.1:latest', //mistral-nemo:12b has a peculiar behavior with the tool calls, so we are using llama3.1:latest for now
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
