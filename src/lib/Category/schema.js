const schema = /* GraphQL */`
	# @types
	# Category
	type Category {
		id: ID!
		name: String!
		shortName: String
		pluralName: String
		aliases: [String]
		parentId: ID
		status: String!
		createdAt: String!
		updatedAt: String!
		parent: Category
		parentTree(depth: Int): [Category]
		children: [Category]
		childrenTrees(depth: Int): [[Category]]
	}

	@connection(Category)

	# @queries
	category(
		id: ID
		name: String,
		shortName: String,
	): Category

	categories(
		id: ID,
		name: String,
		shortName: String,
		pluralName: String,
		parentId: Int,
		search: String,
		status: String,
		paging: Default,
	): CategoryConnection

	# @mutations

	saveCategory(
		id: ID,
		name: String,
		shortName: String,
		pluralName: String,
		aliases: [String],
		parentId: ID,
		status: String
	): Category

	deleteCategory(
		id: ID,
	): DeletedItem
`;

export default schema;
