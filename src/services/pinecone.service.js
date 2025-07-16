import { Pinecone } from '@pinecone-database/pinecone';
import { CONFIG } from '../config/constants.js';

export class PineconeService {
	constructor() {
		this.pineconeConcection = new Pinecone({
			apiKey: CONFIG.PINECONE.APIKEY,
		});

		this.namespace = this.pineconeConcection
			.index(CONFIG.PINECONE.INDEX_NAME, CONFIG.PINECONE.INDEX_HOST)
			.namespace(CONFIG.PINECONE.NAMESPACE);
	}

	async searchRecords(criteria) {
		console.log(criteria.criteria);

		return await this.namespace.searchRecords({
			query: {
				topK: 5,
				inputs: { text: criteria.criteria },
			},
			fields: ['category', 'text'],
		});
	}
}
