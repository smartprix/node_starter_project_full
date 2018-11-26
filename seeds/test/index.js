const knexUtils = require('@smpx/knex-utils');
const path = require('path');

const dataPath = path.join(__dirname, '../dummy');
exports.seed = async function (knex) {
	// fix autoincrement on postgres
	knexUtils.setKnex(knex);
	await knexUtils.seedFolder(dataPath);
};
