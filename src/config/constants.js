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
		WELCOME: 'Digite algo ou pressione Ctrl+C para sair',
		GOODBYE: 'Até logo!',
		INTERRUPTED: '\nPrograma interrompido pelo usuário (Ctrl+C)',
		PROMPT: '> ',
	},
};
