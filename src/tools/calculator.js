export class CalculatorTools {
	constructor() {
		this.availableFunctions = {
			addTwoNumbers: this.addTwoNumbers.bind(this),
			subtractTwoNumbers: this.subtractTwoNumbers.bind(this),
			multiplyTwoNumbers: this.multiplyTwoNumbers.bind(this),
			divideTwoNumbers: this.divideTwoNumbers.bind(this),
		};

		this.tools = [
			this.addTwoNumbersTool,
			this.subtractTwoNumbersTool,
			this.multiplyTwoNumbersTool,
			this.divideTwoNumbersTool,
		];
	}

	addTwoNumbers(a, b) {
		return Number(a) + Number(b);
	}

	subtractTwoNumbers(a, b) {
		return Number(a) - Number(b);
	}

	multiplyTwoNumbers(a, b) {
		return Number(a) * Number(b);
	}

	divideTwoNumbers(a, b) {
		if (Number(b) === 0) {
			throw new Error('Division by zero is not allowed');
		}
		return Number(a) / Number(b);
	}

	addTwoNumbersTool = {
		type: 'function',
		function: {
			name: 'addTwoNumbers',
			description: 'Add two numbers together',
			parameters: {
				type: 'object',
				required: ['a', 'b'],
				properties: {
					a: { type: 'number', description: 'The first number' },
					b: { type: 'number', description: 'The second number' },
				},
			},
		},
	};

	subtractTwoNumbersTool = {
		type: 'function',
		function: {
			name: 'subtractTwoNumbers',
			description: 'Subtract the second number from the first number',
			parameters: {
				type: 'object',
				required: ['a', 'b'],
				properties: {
					a: { type: 'number', description: 'The first number (minuend)' },
					b: { type: 'number', description: 'The second number (subtrahend)' },
				},
			},
		},
	};

	multiplyTwoNumbersTool = {
		type: 'function',
		function: {
			name: 'multiplyTwoNumbers',
			description: 'Multiply two numbers together',
			parameters: {
				type: 'object',
				required: ['a', 'b'],
				properties: {
					a: { type: 'number', description: 'The first number' },
					b: { type: 'number', description: 'The second number' },
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
}
