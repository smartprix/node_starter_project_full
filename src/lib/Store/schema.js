const schema = /* GraphQL */`
	# @types
	# Store
	type Store {
		id: ID!
		name: String!
		shortName: String!
		link: String!
		domain: String!
		status: String!
		rating: Int!
		createdAt: String!
		updatedAt: String!
	}

	@connection(Store)

	# @queries
	store(
		id: ID,
		name: String,
		shortName: String,
		domain: String,
	): Store

	stores(
		id: ID,
		name: String,
		shortName: String,
		domain: String,
		search: String,
		status: String,
		sort: String,
		order: String,
		paging: Default,
	): StoreConnection

	# @mutations
	saveStore(
		id: ID,
		name: String,
		shortName: String,
		link: URL,
		domain: String,
		status: String,
		rating: ID,
	): Store

	deleteStore(
		id: ID,
	): DeletedItem
`;

export default schema;
