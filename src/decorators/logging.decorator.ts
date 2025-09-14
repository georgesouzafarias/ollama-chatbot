import { LoggerService } from '../services/logger.service.js';

export function logger(target: any, ctx: ClassMethodDecoratorContext): any {
	const methodName = String(ctx.name);

	return async function (this: any, ...args: any[]) {
		const className = this.constructor.name;
		const loggerService = LoggerService.getInstance();

		loggerService.info(`${className}.${methodName} called`);

		try {
			const result = await target.call(this, ...args);
			loggerService.info(`${className}.${methodName} completed`);
			return result;
		} catch (error: any) {
			loggerService.error(
				`${className}.${methodName} failed: ${error.message}`,
			);
			throw error;
		}
	};
}
