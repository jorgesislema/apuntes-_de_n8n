import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class JsonPlaceholderApi implements ICredentialType {
	name = 'jsonPlaceholderApi';
	displayName = 'JSONPlaceholder API';
	documentationUrl = 'https://jsonplaceholder.typicode.com/guide/';
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://jsonplaceholder.typicode.com',
			description: 'Base URL for the JSONPlaceholder API',
		},
	];
}
