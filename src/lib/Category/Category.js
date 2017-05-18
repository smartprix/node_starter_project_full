import {Model} from 'xorm';

const stringRequired = {
	type: 'string',
	required: true,
	minLength: 1,
};

class Category extends Model {
	static softDelete = true;

	static jsonSchema = {
		type: 'object',
		properties: {
			name: stringRequired,
			shortName: stringRequired,
			pluralName: stringRequired,
			status: stringRequired,
		},
	};

	static $relations() {
		this.belongsTo('Category', {
			name: 'parent',
			joinFrom: 'Category.parentId',
			joinTo: 'Category.id',
		});
		this.hasMany('Category', {
			name: 'children',
			joinFrom: 'Category.id',
			joinTo: 'Category.parentId',
		});
	}

	async getParentTree(depth = 0) {
		const eager = depth ? `[parent.^${depth}]` : '[parent.^]';
		await this.$loadRelated(eager);

		let parent = this.parent;
		const tree = [];
		while (parent) {
			tree.push(parent);
			parent = parent.parent;
		}

		return tree.reverse();
	}

	async getChildrenTrees(depth = 0) {
		const eager = depth ? `[children.^${depth}]` : '[children.^]';
		await this.$loadRelated(eager);

		const childrenTrees = [];

		const makeTree = (children, childTree) => {
			children.forEach((child) => {
				const tree = childTree.concat(child);

				if (child.children && child.children.length) {
					makeTree(child.children, tree);
				}

				childrenTrees.push(tree);
			});
		};

		makeTree(this.children, []);
		return childrenTrees;
	}

	static async getDuplicate(category) {
		const query = this.query();
		if (category.id) {
			query.whereNot('id', category.id);
		}

		query.where((q) => {
			category.aliases.map(_.trim).forEach((alias) => {
				q.orWhereRaw('name = ?', alias);
				q.orWhereRaw("CONCAT(',', aliases, ',') LIKE ?", `%,${alias},%`);
			});

			q.orWhereRaw('name = ?', category.name);
			q.orWhereRaw("CONCAT(',', aliases, ',') LIKE ?", category.name);
		});

		return query.first();
	}
}

export default Category;
