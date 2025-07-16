import { PineconeService } from '../services/pinecone.service.js';

export class PineconeStoreTools {
	constructor() {
		this.availableFunctions = {
			searchRecords: this.searchRecords.bind(this),
		};
		this.pineconeService = new PineconeService();

		this.tools = [this.searchRecordsTool];
	}

	searchRecords(criteria) {
		console.log('here');

		return this.pineconeService.searchRecords(criteria);
	}

	searchRecordsTool = {
		type: 'function',
		function: {
			name: 'searchRecords',
			description: 'Access to VectorStore to find some criteria',
			parameters: {
				type: 'object',
				required: ['criteria'],
				properties: {
					criteria: {
						type: 'string',
						description: 'criteria to be search for',
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
