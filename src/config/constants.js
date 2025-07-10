export const CONFIG = {
	OLLAMA: {
		STREAM: true,
		MODEL: 'deepseek-r1:7b',
		THINK: true,
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
