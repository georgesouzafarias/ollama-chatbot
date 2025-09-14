import { LoggerService } from '../services/logger.service.js';

export function logger(target: any, ctx: ClassMethodDecoratorContext): void {
	const methodName = String(ctx.name);
	const className = target.constructor.name;

	const loggerService = LoggerService.getInstace();
	loggerService.info(`${className}.${methodName} called`);
}
