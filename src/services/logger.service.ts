import { Logger } from '../utils/logfile.utils.js';

export class LoggerService {
	private readonly logger: Logger = new Logger();
	public logstream: any;
	private static instance: LoggerService;

	public static getInstace(): LoggerService {
		if (!LoggerService.instance) {
			LoggerService.instance = new LoggerService();
			LoggerService.instance.initialize();
		}
		return LoggerService.instance;
	}
	public initialize(): void {
		this.logstream = this.logger.openLogFile();
	}

	public info(message: string, data?: any): void {
		this.logger.info(message, data);
	}
}
