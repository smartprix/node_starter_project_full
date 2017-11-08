exports.up = function (knex) {
	return knex.schema.createTableIfNotExists('Store', (table) => {
		table.increments('id').primary();
		table.string('name').notNullable();
		table.string('shortName').notNullable();
		table.text('link').notNullable();
		table.string('domain').notNullable();
		table.string('status').notNullable();
		table.integer('rating').notNullable();
		table.timestamp('createdAt').nullable();
		table.timestamp('updatedAt').nullable();
		table.timestamp('deletedAt').nullable();
	})
		.createTableIfNotExists('Brand', (table) => {
			table.increments('id').primary();
			table.string('name').notNullable();
			table.string('aliases').notNullable();
			table.string('status').notNullable();
			table.timestamp('createdAt').nullable();
			table.timestamp('updatedAt').nullable();
			table.timestamp('deletedAt').nullable();
		})
		.createTableIfNotExists('Category', (table) => {
			table.increments('id').primary();
			table.string('name').notNullable();
			table.string('shortName').notNullable();
			table.string('pluralName').notNullable();
			table.string('aliases').notNullable();
			table.integer('parentId').notNullable();
			table.string('status').notNullable();
			table.jsonb('metadata').notNullable();
			table.timestamp('createdAt').nullable();
			table.timestamp('updatedAt').nullable();
			table.timestamp('deletedAt').nullable();

			table.unique('name');
			table.unique('shortName');
		})
		.createTableIfNotExists('BrandCategoryMap', (table) => {
			table.string('brandId').notNullable();
			table.string('categoryId').notNullable();
		});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists('Store')
		.dropTableIfExists('Brand')
		.dropTableIfExists('Category')
		.dropTableIfExists('BrandCategoryMap');
};
