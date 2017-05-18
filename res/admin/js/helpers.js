import startsWith from 'lodash/startsWith';
import Axios from 'axios';
import {
	handleGraphqlRequest,
	convertGraphql,
	toGqlArg,
} from 'vutils';

const GRAPHQL_ENDPOINT = '/api';

function graphqlReqest(graphqlQuery) {
	return handleGraphqlRequest(Axios.post(GRAPHQL_ENDPOINT, {
		query: convertGraphql(graphqlQuery),
	}));
}

function query(graphqlQuery) {
	if (!startsWith(graphqlQuery, 'query')) {
		graphqlQuery = `query { ${graphqlQuery} }`;
	}

	return graphqlReqest(graphqlQuery);
}

function mutation(graphqlQuery) {
	if (!startsWith(graphqlQuery, 'mutation')) {
		graphqlQuery = `mutation { ${graphqlQuery} }`;
	}

	return graphqlReqest(graphqlQuery);
}

export {
	toGqlArg,
	query,
	mutation,
};
