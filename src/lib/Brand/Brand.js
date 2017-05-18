import {Model} from 'xorm';

class Brand extends Model {
	static softDelete = true;

	static jsonSchema = {
		type: 'object',
		properties: {
			name: {type: 'string', required: true, minLength: 1},
			status: {type: 'string', required: true, minLength: 1},
		},
	};

	static $relations() {
		this.hasManyThrough('Category', {
			name: 'categories',
			through: {
				from: 'BrandCategoryMap.brandId',
				to: 'BrandCategoryMap.categoryId',
			},
		});
	}

	static async getDuplicate(brand) {
		const query = this.query();
		if (brand.id) {
			query.whereNot('id', brand.id);
		}

		query.where((q) => {
			brand.aliases.map(_.trim).forEach((alias) => {
				q.orWhereRaw('name = ?', alias);
				q.orWhereRaw("CONCAT(',', aliases, ',') LIKE ?", `%,${alias},%`);
			});

			q.orWhereRaw('name = ?', brand.name);
			q.orWhereRaw("CONCAT(',', aliases, ',') LIKE ?", brand.name);
		});

		return query.first();
	}
}

export default Brand;
