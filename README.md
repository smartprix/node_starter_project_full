# NodeJS Starter Project
This is an empty project for quickly starting up with nodejs.
This is meant for projects which will have both a backend and a frontend.
If you are writing only backend, use http://github.com/smartprix/nodejs_starter_project

#### Features:
* git & git-hooks
* eslint & default conventions (https://github.com/smartprix/js_conventions)
* babel
* testing with mocha and chai
* production running with pm2
* lodash and sm-utils already installed
* Backend server with Koa
* Frontend using webpack & vuejs
* Auto reload backend using nodemon, and frontend using hot reloading

#### Conventions:
* Keep all your backend source code in src directory
* Keep all your frontend source code in res directory
  * js in `res/js`
  * css in `res/css`
  * vue components in `res/js/components`
  * images in `res/img`
  * other assets (eg. fonts, etc.) in `res/assets`
  * For more info see: https://github.com/smartprix/sm-webpack-config
* Keep all your test cases (with mocha) in test directory
* Compiled code (from babel) will be stored in dist directory
* Keep all your garbage files (temporary testing and all) in garbage directory

#### Setting Up For The First Time
If you've just installed ubuntu, you can run these commands to install
various softwares and packages that will help you run and develop this project.

```sh
sudo apt update -y
sudo apt install unzip -y
cd ~ && mkdir -p setup && cd setup
wget https://github.com/smartprix/node_starter_project_full/archive/master.zip
unzip -o master.zip
cd node_starter_project_full-master/setup
unzip -o ansible.zip -d ansible/
bash setup.sh
cd ansible
sudo bash dev_machine_setup
```

#### How To Start:
* Clone this repository
* Run `yarn` to install dependencies.
* Create a database named `starter` in your postgres server
* Run `npm run migrate`
* You are ready. Start writing your code in `src/index.js`

#### Commands:
```bash
# Run eslint to check coding conventions
npm run lint

# Run eslint and try to fix linting errors
npm run lint:fix

# Run migration
npm run migrate

# Create a new migration
npm run migrate:create migration_name

# Run tests
npm test

# Compile Files
npm run build

# Start dev server (backend)
npm start

# Start dev server (basic frontend)
npm run basic

# Start dev server (admin frontend)
npm run admin
```

#### Managing Config:
We use `sm-utils` `cfg` to manage config.

The configuration options can be written in `config.js` and `private/config.js`. Config options in both these files are merged, and the options present in `private/config.js` are given higher priority over those present in `config.js` (i.e. private config options overwrite the options in general config when merged).

Values from the config can be accessed via `cfg(optionToBeRead)`. You can also provide a default value (such as `cfg(foo, 'bar')`) while accessing any of the options. If the key/option is not found in the config, then the default value will be returned (thus, in case `foo` is not present in the merged config the `'bar'` will be returned).

`cfg` also has functions such as `isDev`, `isProd`, `isTest`, etc. which returns `true/false` on the basis of the current process' (node) environment.

### Backend
#### Adding a new Model:
We use the [`xorm`](https://github.com/smartprix/xorm) ORM, which is based on [`ObjectionJS`](https://github.com/Vincit/objection.js/ "ObjectionJS GitHub Repo").

`xorm` provides with a `Model` class which is basically a wrapper for the `Model` class from `ObjectionJS` with some added utilities (like *soft delete*, etc). Models can optionally define a `jsonSchema` object that is used for input validation. All your relationships can be defined using the static `relationMappings` property (as done for ObjectionJS models) or in the `$relations` method (provided by `xorm`).

The `src/lib` folder has a `models.js` file which is used to export the models to other places in the project. You can list your model in that file so that you can import models from `src/lib/models`.

#### Schemas and Resolvers:
You can define `GraphQL` *schemas* and *resolvers* for queries and mutations related to your model in the same module as your model and export them as `schema` and `resolvers` respectively.

The `makeSchemaFromModules` function from [`gqutils`](https://github.com/smartprix/gqutils) creates the schemas on the basis of your schema definitions and associates the resolvers wherever required. This process of creation of schemas is performed in `src/graphql.js` file. So you would want to list your module in that file.

Following is a simple example of how each of the above mentioned files might look

##### Employee.js (the Model)
```js
import {Model} from 'xorm'; // import the 'Model' class from xorm

class Employee extends Model { // our model extends the 'Model' class
	static softDelete = true; // this is an added utility, you can read more about this in xorm

	// this jsonSchema will be used to validate the input
    	// whenever an instance of this model will be created
	static jsonSchema = {
		type: 'object',
		properties: {
			id: {type: 'string', required: true},
			name: {type: 'string', required: true, minLength: 1},
		},
	};

	// these are the relationships which this model has
	static $relations() {
		this.belongsTo('Employee', {
			name: 'supervisor',
			joinFrom: 'Employee.supervisorId',
			joinTo: 'Employee.id',
		});
	}
}

export default Employee;
```

##### schema.js (the schemas)
```js
// this defines a graphql type
const Employee = {
	graphql: 'type',
	schema: ['admin'],
	fields: {
		id: 'ID!',
		name: 'String!',
		address: 'String',
		post: 'String',
		supervisorId: 'ID',
		supervisor: 'Employee',
		createdAt: 'String!',
		updatedAt: 'String!',
	},
};

// a graphql query
const getEmployee = {
	graphql: 'query',
	schema: ['admin'],
	name: 'employee',
	type: 'Employee',
	args: {
		$default: ['id', 'name'],
	},
};

// a graphql mutation
const saveEmployee = {
	graphql: 'mutation',
	schema: ['admin'],
	type: 'Employee',
	args: {
		$default: [
			'id',
			'name',
			'address',
			'post',
		],
		supervisorId: 'ID',
	},
};

const deleteEmployee = {
	graphql: 'mutation',
	schema: ['admin'],
	type: 'DeletedItem',
	args: {
		id: 'ID!',
	},
};

export default {
	Employee,
	getEmployee,
	saveEmployee,
	deleteEmployee,
};
```

##### resolvers.js (the resolvers)
```js
import {Employee} from '../models';

export default {
	Query: {
		employee: Employee.getFindOneResolver(),
	},

	Mutation: {
		async saveEmployee(root, employee) {
			return Employee.query().saveAndFetch(employee);
		},

		deleteEmployee: Employee.getDeleteByIdResolver(),
	},

	Employee: {
		supervisor: employee => employee.loadByRelation('supervisor'),
	},
};
```

For more information/examples on how you should define the *schemas*, you can go to https://github.com/smartprix/gqutils.

### Frontend
We use [`VueJS`](https://github.com/vuejs/vue) for the frontend.

The vue components go into the `res/js/components` folder. We use the [`single-file component`](https://vuejs.org/v2/guide/single-file-components.html) design, i.e. the template, script and style all go into the same file.

Most of the components in the frontend are added in sets of three (for example, `Employee.vue`, `Employees.vue`, `EmployeeForm.vue`).

* `Employees.vue` - This component will have a list of employees with an option to edit any of the existing employees or another option to add a new employee. Clicking on any of these two options will cause the new component to open in a right modal.
* `Employee.vue` - This component contains the data of a particular employee (and generally contains the `EmployeeForm` component along with other components if required). It opens whenever you click on the edit option for any of the employees in the `Employees` component.
* `EmployeeForm.vue` - This component contains the form which contains the data.

All requests to the server are handled using the `$api` object. All api functions go inside the `res/js/api` folders. To make an api call you can do `this.$api.nameOfTheApiFunction` inside your components.

The frontend uses a lot of elements from the [element UI Toolkit](https://github.com/ElemeFE/element) and the [el-admin Toolkit](https://github.com/smartprix/el-admin).

*Note: Elements with the prefix* 'el-' *come from the* `element` *toolkit whereas those with the prefix* 'ela-' *come from the* `el-admin` *toolkit.*

Following are examples of how simple component files for the **employee** example (used in the backend) might look like

##### Employees.vue
```js
<template>
	<ela-content-layout padding="0">
		<div slot="head">
			<h3>Employees</h3>
			<div class="header-right">
				<el-button
					type="primary"
					icon="el-icon-plus"
					@click="$view.employee()">Add Employee
				</el-button>
			</div>
		</div>

		<div slot="filters">
			<el-row type="flex">
				<ela-filter-item label="Post" :span="6">
					<el-select
						size="small"
						clearable
						v-model="filters.post"
						@change="handleFilterChange">
						<el-option value="softwareDeveloper">Software Developer</el-option>
						<el-option value="softwareDevelopmentIntern">Software Development Intern</el-option>
					</el-select>
				</ela-filter-item>
				<ela-filter-item label="Search" :span="6" float="right">
					<el-input
						icon="el-icon-search"
						size="small"
						v-model="filters.search"
						@click="handleFilterChange"
						@keyup.native.enter="handleFilterChange">
					</el-input>
				</ela-filter-item>
			</el-row>
		</div>

		<el-table
			:data="employees.nodes"
			style="width: 100%"
			stripe
			border
			v-loading="loadingSelfData">
			<el-table-column label="View" align="center" width="90">
				<el-button
					slot-scope="scope"
					type="primary"
					size="small"
					@click="$view.employee(scope.row)">Details
				</el-button>
			</el-table-column>
			<el-table-column prop="id" label="Id" width="60"></el-table-column>
			<el-table-column prop="name" label="Name"></el-table-column>
			<el-table-column prop="post" label="Post"></el-table-column>
		</el-table>

		<div slot="foot">
			<div class="footer-right">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="filters.page"
					:page-sizes="[20, 50, 100, 250, 500]"
					:page-size="filters.count"
					layout="total, sizes, prev, pager, next, jumper"
					:total="employees.totalCount">
				</el-pagination>
			</div>
		</div>

	</ela-content-layout>
</template>

<script>
import {paginationMixin} from 'vutils';

export default {
	name: 'Employees',

	mixins: [ paginationMixin() ],

	data() {
		return {
			employees: {},
			filters: {
				search: '',
				post: '',
				page: 1,
				count: 20,
			},
		};
	},

	methods: {
		loadSelfData(filters) {
			return this.$api.getEmployees(filters).then((employees) => {
				this.employees = employees;
			});
		},
	},

	events: {
		employeeMutated() {
			this.reloadSelfData();
		},
	},
};
</script>
```

The pagination mixin used in the above code is one of the many utilities in the [`vutils`](https://github.com/smartprix/vutils) package, which will come in handy while working on the project.

##### Employee.vue
```js
<template>
	<ela-content-layout>
		<div slot="head">
			<h3>
				<span v-if="isAdd">Add&nbsp;</span>Employee
				<small v-if="!isAdd">{{ data.name }}</small>
			</h3>
			<div class="header-right">
				<el-button
					type="danger"
					icon="el-icon-delete"
					@click="deleteEmployee(data)"
					v-if="!isAdd">
				</el-button>
			</div>
		</div>
		<el-tabs type="card" slot="tabs">
			<el-tab-pane label="Details" v-loading="loading">
				<employee-form
					:form-data="employee"
					@done="$emit('done')">
				</employee-form>
			</el-tab-pane>
		</el-tabs>
	</ela-content-layout>
</template>

<script>
import EmployeeForm from './EmployeeForm.vue';

export default {
	name: 'Employee',

	reEvents: {delete: 'done'},

	components: {
		EmployeeForm,
	},

	props: {
		data: {
			type: Object,
			modify: 'employee',
		},
		fetch: Boolean,
	},

	data: () => ({
		loading: false,
	}),

	computed: {
		isAdd() {
			return !(this.data && this.data.id);
		},
	},

	created() {
		this.loadEmployee();
	},

	methods: {
		loadEmployee() {
			if (this.fetch) {
				this.loading = true;
				this.$api.getEmployee(this.data.id).then((employee) => {
					this.employee = employee;
					this.loading = false;
				});
			}
		},

		deleteEmployee(employee) {
			this.$confirm(
				'Are you sure?',
				'Delete Employee',
				{type: 'warning'},
			).then(() => {
				this.$api.deleteEmployee(employee.id)
					.then(() => {
						this.$notify({
							title: 'Success',
							message: 'Employee Deleted Successfully',
							type: 'success',
						});
						this.$bus.$emit('employeeMutated', employee);
						this.$emit('done');
					}).catch((res) => {
						this.$notify({
							title: 'Danger',
							message: 'Unable to Delete',
							type: 'danger',
						});
						console.log(res);
						this.$emit('done');
					});
			}).catch(() => {});
		},
	},
};
</script>
```

##### EmployeeForm.vue
```js
<template>
	<div v-loading="loading">
		<el-form
			ref="form"
			:model="employee"
			:rules="rules"
			label-position="top">
			<el-form-item prop="globalError" class="form-global-error"></el-form-item>

			<el-row :gutter="12">
				<el-col :span="16">
					<el-form-item label="Employee Name" prop="name">
						<el-input v-model.trim="employee.name"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="Post" prop="post">
						<el-select v-model="employee.post">
							<el-option value="softwareDeveloper">Software Developer</el-option>
							<el-option value="softwareDevelopmentIntern">Software Development Intern</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>

			<el-form-item label="Address" prop="address">
				<el-input type="textarea" :rows="5" v-model.trim="employee.address"></el-input>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="submit">Submit</el-button>
				<el-button type="text" @click="$emit('done')">Cancel</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	name: 'EmployeeForm',

	props: {
		formData: {
			type: Object,
			default: () => ({
				name: '',
				address: '',
				post: 'Software Developer',
			}),
			modify: 'employee',
		},
	},

	data() {
		return {
			rules: {
				name: [{required: true, message: 'Please Enter Name'}],
				post: [{required: true, message: 'Please Choose Post'}],
			},
			loading: false,
		};
	},

	methods: {
		submit() {
			this.$utils.clearFormErrors(this.$refs.form);
			this.$refs.form.validate((valid) => {
				if (!valid) return;
				this.loading = true;
				this.$api.saveEmployee(this.employee).then(() => {
					this.$notify({
						title: 'Success',
						message: 'Employee Saved Successfully',
						type: 'success',
					});
					this.loading = false;
					this.$bus.$emit('employeeMutated', this.employee);
					this.$emit('done');
				}).catch((res) => {
					this.$utils.setFormErrors(this.$refs.form, res.userErrors);
					this.loading = false;
				});
			});
		},
	},
};
</script>
```

The api functions used should be present in the `js/api` folder. You generally keep all the related api functions in the same file, thus all the functions used in the above examples might look like this (present in `employee.js` file in the `js/api` folder)

##### employee.js (the api functions)
```js
import {query, mutation, toGqlArg as arg} from '../helpers';

const fields = `
	id
	name
	address
	post
`;

function getEmployee(id) {
	return query(`employee(id: ${id}) { ${fields} }`)
		.then(data => data.employee);
}

function getEmployees(search) {
	return query(`employees(${arg(search)}) {
		nodes { ${fields} }
		totalCount
		pageInfo {
			startCursor
			endCursor
			hasNextPage
			hasPreviousPage
			edgeCount
		}
	}`)
		.then(data => data.employees);
}

function saveEmployee(employee) {
	const pick = ['id', 'name', 'address', 'post'];
	return mutation(`saveEmployee(${arg(employee, pick)}) { ${fields} }`)
		.then(data => data.saveEmployee);
}

function deleteEmployee(employeeId) {
	return mutation(`deleteEmployee(id: ${employeeId}) {
		id
	}`);
}

export {
	getEmployee,
	getEmployees,
	saveEmployee,
	deleteEmployee,
};
```

The above example uses some functions imported from the `helpers.js` file. This file contains various kind of helper functions used in the project. You can go through the file to get an idea what each of these function does (they are basically used to wrap the query/mutation in the request sent to the server).

### Adding Tests
All tests are added inside the `test` folder. We use the [`mocha`](https://mochajs.org/) test framework along with the [`chai`](http://www.chaijs.com/) assertion library.

Names of all test files must end with `.test.js`. To run all the tests you can use `npm run test` from the terminal.

The file `test/index.test.js` contains a simple example describing what a test should look like.

For **API** testing, a file named `api.test.js` already exists in the `test` folder. It tests all the queries and mutations listed in the `test/api` folder.

You can describe tests for APIs as objects.

Objects describing test case for a query should have a `query`, and either an `expectFunction` or an `expect`.

* `query` - the GraphQL query
* `expectFunction` - a custom function describing what the test expects
* `expect` - the object/value to be expected as the result

An object describing a test for a query might look like as follows:
```js
const employee = {
	query: `query {
		employee(id: 1) {
			id
			name
			post
		}
	}`,
	expect: {
		id: '1',
		name: 'XYZ',
		post: 'Software Developer',
	},
};
```

Objects describing test case for a mutation should have a `mutation`, a `query` and an `expect`.

* `mutation` - the GraphQL mutation
* `query` - a **function** which expects an _id_ and returns a GraphQL query to be executed in order to test whether the mutation worked correctly
* `expect` - the object/value to be expected as the result of the query (not the mutation)

*Note: The `query` is executed only in case an `id` is received in the response of the mutation. And that `id` itself is sent as an argument to the `query` function*

An object describing a test for a query might look as follows:
```js
const saveEmployee = {
	mutation: `mutation {
		saveEmployee(name: "XYZ", post: "Software Developer") {
			id
		}
	}`,
	query: id => `query {
			employee(id: ${id}) {
				name
				post
			}
		}`,
	expect: {
		employee: {
			name: 'XYZ',
			post: 'Software Developer',
		},
	},
};
```
