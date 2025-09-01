export class CalculatorTools {
	public availableFunctions: Record<string, Function>;
	private tools: any[];

	constructor() {
		this.availableFunctions = {
			addNumbers: this.addNumbers.bind(this),
			subtractNumbers: this.subtractNumbers.bind(this),
			multiplyNumbers: this.multiplyNumbers.bind(this),
			divideTwoNumbers: this.divideTwoNumbers.bind(this),
		};

		this.tools = [
			this.addNumbersTool,
			this.subtractNumbersTool,
			this.multiplyNumbersTool,
			this.divideTwoNumbersTool,
		];
	}

	addNumbers(listNumber: number[] = []): number {
		this.checkIsArray(listNumber);
		return listNumber.reduce((result, num) => result + num, 0);
	}

	subtractNumbers(listNumber: number[] = []): number {
		this.checkIsArray(listNumber);
		return listNumber.reduce((result, num) => result - num, 0);
	}

	multiplyNumbers(listNumber: number[] = []): number {
		this.checkIsArray(listNumber);
		return listNumber.reduce((result, num) => result * num, 0);
	}

	divideTwoNumbers(a: number, b: number): number {
		if (Number(b) === 0) {
			throw new Error('Division by zero is not allowed');
		}
		return Number(a) / Number(b);
	}

	addNumbersTool = {
		type: 'function',
		function: {
			name: 'addNumbers',
			description: 'Sum a list of numbers',
			parameters: {
				type: 'list',
				required: ['array'],
				properties: {
					array: { type: 'list', description: 'list of numbers' },
				},
			},
		},
	};

	subtractNumbersTool = {
		type: 'function',
		function: {
			name: 'subtractNumbers',
			description: 'Subtract numbers',
			parameters: {
				type: 'list',
				required: ['array'],
				properties: {
					array: { type: 'list', description: 'list of numbers' },
				},
			},
		},
	};

	multiplyNumbersTool = {
		type: 'function',
		function: {
			name: 'multiplyNumbers',
			description: 'Multiply numbers together',
			parameters: {
				type: 'list',
				required: ['array'],
				properties: {
					array: { type: 'list', description: 'list of numbers' },
				},
			},
		},
	};

	divideTwoNumbersTool = {
		type: 'function',
		function: {
			name: 'divideTwoNumbers',
			description: 'Divide the first number by the second number',
			parameters: {
				type: 'object',
				required: ['a', 'b'],
				properties: {
					a: {
						type: 'number',
						description: 'The dividend (number to be divided)',
					},
					b: {
						type: 'number',
						description: 'The divisor (number to divide by)',
					},
				},
			},
		},
	};

	getTools() {
		return this.tools;
	}

	getAvailableFunctions() {
		return Object.keys(this.availableFunctions);
	}

	checkIsArray(numbers: any): boolean {
		if (!Array.isArray(numbers)) {
			throw new Error('Input must be an array of number');
		}
		return true;
	}
}
