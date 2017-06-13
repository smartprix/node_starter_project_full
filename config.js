const _ = require('lodash');

const config = {
	debug: false,
	db: {
		host: 'localhost',
		user: 'root',
		password: 'smartprix',
	},
};

// Read private config and merge it with this config
try {
	configPrivate = require('./private/config.js');	// eslint-disable-line
	module.exports = _.assign(config, configPrivate);
}
catch (e) {
	module.exports = config;
}
