import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class JsonPlaceholder implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'JSONPlaceholder',
		name: 'jsonPlaceholder',
		icon: 'file:jsonplaceholder.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume JSONPlaceholder API for testing and prototyping',
		defaults: {
			name: 'JSONPlaceholder',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'jsonPlaceholderApi',
				required: false,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Post',
						value: 'post',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'post',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['post'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all posts',
						action: 'Get all posts',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a post',
						action: 'Get a post',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new post',
						action: 'Create a post',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a post',
						action: 'Update a post',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a post',
						action: 'Delete a post',
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all users',
						action: 'Get all users',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a user',
						action: 'Get a user',
					},
				],
				default: 'getAll',
			},
			// Post ID parameter
			{
				displayName: 'Post ID',
				name: 'postId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: 1,
				description: 'The ID of the post',
			},
			// User ID parameter
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['get'],
					},
				},
				default: 1,
				description: 'The ID of the user',
			},
			// Post creation/update fields
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				description: 'Title of the post',
			},
			{
				displayName: 'Body',
				name: 'body',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				description: 'Body content of the post',
			},
			{
				displayName: 'User ID',
				name: 'postUserId',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['post'],
						operation: ['create', 'update'],
					},
				},
				default: 1,
				description: 'ID of the user who owns the post',
			},
			// Return all results option
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		
		// Get credentials (optional for JSONPlaceholder)
		let credentials;
		try {
			credentials = await this.getCredentials('jsonPlaceholderApi');
		} catch (error) {
			// Credentials are optional, use default base URL
			credentials = {
				baseUrl: 'https://jsonplaceholder.typicode.com',
			};
		}

		const baseUrl = credentials.baseUrl || 'https://jsonplaceholder.typicode.com';

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			try {
				let responseData;

				if (resource === 'post') {
					responseData = await this.handlePostOperations(i, operation, baseUrl);
				} else if (resource === 'user') {
					responseData = await this.handleUserOperations(i, operation, baseUrl);
				}

				if (Array.isArray(responseData)) {
					returnData.push(...responseData.map(item => ({ json: item })));
				} else {
					returnData.push({ json: responseData });
				}

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}

	private async handlePostOperations(
		itemIndex: number,
		operation: string,
		baseUrl: string,
	): Promise<any> {
		const helpers = this.getHelpers();

		switch (operation) {
			case 'getAll': {
				const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
				const limit = this.getNodeParameter('limit', itemIndex, 50) as number;

				const requestOptions = {
					method: 'GET',
					url: `${baseUrl}/posts`,
					json: true,
				};

				let responseData = await helpers.request(requestOptions);

				if (!returnAll) {
					responseData = responseData.slice(0, limit);
				}

				return responseData;
			}

			case 'get': {
				const postId = this.getNodeParameter('postId', itemIndex) as number;

				const requestOptions = {
					method: 'GET',
					url: `${baseUrl}/posts/${postId}`,
					json: true,
				};

				return await helpers.request(requestOptions);
			}

			case 'create': {
				const title = this.getNodeParameter('title', itemIndex) as string;
				const body = this.getNodeParameter('body', itemIndex) as string;
				const userId = this.getNodeParameter('postUserId', itemIndex) as number;

				const requestOptions = {
					method: 'POST',
					url: `${baseUrl}/posts`,
					json: true,
					body: {
						title,
						body,
						userId,
					},
				};

				return await helpers.request(requestOptions);
			}

			case 'update': {
				const postId = this.getNodeParameter('postId', itemIndex) as number;
				const title = this.getNodeParameter('title', itemIndex) as string;
				const body = this.getNodeParameter('body', itemIndex) as string;
				const userId = this.getNodeParameter('postUserId', itemIndex) as number;

				const requestOptions = {
					method: 'PUT',
					url: `${baseUrl}/posts/${postId}`,
					json: true,
					body: {
						id: postId,
						title,
						body,
						userId,
					},
				};

				return await helpers.request(requestOptions);
			}

			case 'delete': {
				const postId = this.getNodeParameter('postId', itemIndex) as number;

				const requestOptions = {
					method: 'DELETE',
					url: `${baseUrl}/posts/${postId}`,
					json: true,
				};

				return await helpers.request(requestOptions);
			}

			default:
				throw new NodeOperationError(
					this.getNode(),
					`The operation "${operation}" is not supported for resource "${resource}"!`,
				);
		}
	}

	private async handleUserOperations(
		itemIndex: number,
		operation: string,
		baseUrl: string,
	): Promise<any> {
		const helpers = this.getHelpers();

		switch (operation) {
			case 'getAll': {
				const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
				const limit = this.getNodeParameter('limit', itemIndex, 50) as number;

				const requestOptions = {
					method: 'GET',
					url: `${baseUrl}/users`,
					json: true,
				};

				let responseData = await helpers.request(requestOptions);

				if (!returnAll) {
					responseData = responseData.slice(0, limit);
				}

				return responseData;
			}

			case 'get': {
				const userId = this.getNodeParameter('userId', itemIndex) as number;

				const requestOptions = {
					method: 'GET',
					url: `${baseUrl}/users/${userId}`,
					json: true,
				};

				return await helpers.request(requestOptions);
			}

			default:
				throw new NodeOperationError(
					this.getNode(),
					`The operation "${operation}" is not supported for resource "${resource}"!`,
				);
		}
	}
}
