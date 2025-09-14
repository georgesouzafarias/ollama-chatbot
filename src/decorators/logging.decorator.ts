import { LoggerService } from '../services/logger.service.js';

export function logger(target: any, ctx: ClassMethodDecoratorContext): any {
	const methodName = String(ctx.name);
	const className = target.constructor.name;

	return function (this: any, ...args: any[]) {
		const loggerService = LoggerService.getInstace();
		loggerService.info(`${className}.${methodName} called`);

		try {
			const result = target.call(this, ...args);
			if (result instanceof Promise) {
				return result
					.then((data) => {
						loggerService.info(`${className}.${methodName} completed`);
						return data;
					})
					.catch((error) => {
						loggerService.info(
							`${className}.${methodName} failed: ${error.message}`,
						);
						throw error;
					});
			}
			loggerService.info(`${className}.${methodName} completed`);
			return result;
		} catch (error: any) {
			loggerService.info(`${className}.${methodName} failed: ${error.message}`);
			throw error;
		}
	};
}
