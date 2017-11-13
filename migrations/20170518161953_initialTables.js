exports.up = function (knex) {
	return knex.schema.createTableIfNotExists('Store', (table) => {
		table.increments('id').primary();
		table.string('name').notNullable();
		table.string('shortName').notNullable();
		table.text('link').notNullable();
		table.string('domain').notNullable();
		table.string('status').notNullable();
		table.integer('rating').nullable();
		table.timestamp('createdAt').nullable();
		table.timestamp('updatedAt').nullable();
		table.timestamp('deletedAt').nullable();
	})
		.createTableIfNotExists('Brand', (table) => {
			table.increments('id').primary();
			table.string('name').notNullable().defaultTo('');
			table.string('aliases').notNullable().defaultTo('');
			table.string('status').notNullable().defaultTo('');
			table.timestamp('createdAt').nullable();
			table.timestamp('updatedAt').nullable();
			table.timestamp('deletedAt').nullable();
		})
		.createTableIfNotExists('Category', (table) => {
			table.increments('id').primary();
			table.string('name').notNullable().defaultTo('');
			table.string('shortName').notNullable().defaultTo('');
			table.string('pluralName').notNullable().defaultTo('');
			table.string('aliases').notNullable().defaultTo('');
			table.integer('parentId').notNullable().defaultTo(0);
			table.string('status').notNullable().defaultTo('');
			table.jsonb('metadata').notNullable().defaultTo('{}');
			table.timestamp('createdAt').nullable();
			table.timestamp('updatedAt').nullable();
			table.timestamp('deletedAt').nullable();

			table.unique('name');
			table.unique('shortName');
		})
		.createTableIfNotExists('BrandCategoryMap', (table) => {
			table.integer('brandId').notNullable().defaultTo(0);
			table.integer('categoryId').notNullable().defaultTo(0);
		});
};

exports.down = function (knex) {
	return knex.schema.dropTableIfExists('Store')
		.dropTableIfExists('Brand')
		.dropTableIfExists('Category')
		.dropTableIfExists('BrandCategoryMap');
};
