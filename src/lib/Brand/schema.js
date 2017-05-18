const schema = /* GraphQL */`
	# @types
	# Brand
	type Brand {
		id: ID!
		name: String!
		aliases: [String]
		status: String!
		createdAt: String!
		updatedAt: String!
		categories: [Category]
	}

	@connection(Brand)

	# @queries
	brand(
		id: ID
		name: String,
	): Brand

	brands(
		id: ID,
		name: String,
		aliases: String,
		search: String,
		status: String,
		paging: Default,
	): BrandConnection

	# @mutations
	saveBrand(
		id: ID,
		name: String,
		aliases: [String],
		categoryIds: [ID],
		status: String,
	): Brand

	deleteBrand(
		id: ID,
	): DeletedItem
`;

export default schema;
