import { CONFIG } from '../config/constants.js';
import pino from 'pino';
import type { Logger as PinoLogger } from 'pino';

export class Logger {
	private readonly filepath: string = CONFIG.SYSTEM.LOGPATH;
	private pinoInstance: PinoLogger | null = null;

	public openLogFile(filePath: string = this.filepath): PinoLogger {
		this.pinoInstance ??= pino(
			{
				level: 'info',
				formatters: {
					level: (label) => {
						return { level: label };
					},
					bindings(bindings) {
						return {};
					},
				},
				timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
			},
			pino.destination({
				dest: filePath,
				minLength: 4096,
				sync: false,
			}),
		);

		return this.pinoInstance;
	}

	public writeLogFile(
		level: 'info' | 'error' | 'warn' | 'debug',
		message: string,
		data?: any,
	): void {
		this.pinoInstance ??= this.openLogFile();
		this.pinoInstance?.[level](data, message);
	}

	public info(message: string, data?: any): void {
		this.writeLogFile('info', message, data);
	}

	public error(message: string, error?: Error | any): void {
		this.writeLogFile('error', message, error);
	}

	public warn(message: string, data?: any): void {
		this.writeLogFile('warn', message, data);
	}

	public debug(message: string, data?: any): void {
		this.writeLogFile('debug', message, data);
	}

	public close(): void {
		if (this.pinoInstance) {
			this.pinoInstance.flush();
		}
	}
}
