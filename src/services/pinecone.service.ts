import { Pinecone } from '@pinecone-database/pinecone';
import { CONFIG } from '../config/constants.js';
import { logger } from '../decorators/logging.decorator.js';

export class PineconeService {
	apiKey: string = CONFIG.PINECONE.APIKEY || '';
	namespaceName: string = CONFIG.PINECONE.NAMESPACE || '';
	indexName: string = CONFIG.PINECONE.INDEX_NAME || '';
	indexHost: string = CONFIG.PINECONE.INDEX_HOST || '';
	pineconeConnection: Pinecone;
	namespace: any;

	constructor() {
		this.pineconeConnection = new Pinecone({
			apiKey: this.apiKey,
		});

		this.namespace = this.pineconeConnection
			.index(this.indexName, this.indexHost)
			.namespace(this.namespaceName);
	}

	@logger
	async searchRecords(searchValue: any) {
		return await this.namespace.searchRecords({
			query: {
				topK: 5,
				inputs: { text: searchValue.criteria },
			},
			fields: ['category', 'text'],
		});
	}
}
