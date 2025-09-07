import { PineconeService } from '../services/pinecone.service.js';

export class VectorStoreTools {
	readonly availableFunctions: Record<string, Function>;
	private readonly tools: any[];
	readonly vectorStoreService: PineconeService = new PineconeService();

	constructor() {
		this.availableFunctions = {
			searchVectorStore: this.searchVectorStore.bind(this),
		};
		this.tools = [this.searchRecordsTool];
	}

	async searchVectorStore(criteria: any): Promise<string> {
		return this.vectorStoreService.searchRecords(criteria);
	}

	searchRecordsTool = {
		type: 'function',
		function: {
			name: 'searchVectorStore',
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

	public getTools() {
		return this.tools;
	}

	public getAvailableFunctions() {
		return Object.keys(this.availableFunctions);
	}
}
