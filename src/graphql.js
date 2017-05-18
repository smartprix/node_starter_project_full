import path from 'path';
import {makeSchemaFromModules} from 'gqutils';

const modules = [
	'Store',
	'Category',
	'Brand',
];

const logger = {
	log(e) {
		console.log(e);
	},
};

const {schema, pubsub, subscriptionManager} =
	makeSchemaFromModules(modules, {
		baseFolder: path.join(__dirname, '/lib'),
		logger,
		allowUndefinedInResolve: false,
		resolverValidationOptions: {},
	});

pubsub.out = function (key, message) {
	pubsub.publish('output', {key, message});
};

global.pubsub = pubsub;

export {
	schema,
	pubsub,
	subscriptionManager,
};
