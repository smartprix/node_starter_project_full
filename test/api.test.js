import {Connect} from 'sm-utils';
import {expect} from 'chai';
import {Model} from 'xorm';
import * as knexUtils from '@smpx/knex-utils';

import '../src/global';
import runServer from '../src/index';
import * as queries from './api/queries';
import * as mutations from './api/mutations';

// can't initialize knex now because db may or may not exist
let knex;

before(async function () {
	this.timeout(30000);
	knex = await knexUtils.refreshDb('test');
	Model.knex(knex);
	await runServer();
});

function testQueries(item) {
	it(item + ' query testing', async () => {
		const request = new Connect();
		request.post();
		request.url('http://localhost:5000/api').cookies(true);
		request.body({
			query: queries[item].query,
		});
		const res = await request;
		expect(res.statusCode).to.equal(200);

		if (queries[item].expectFunction) {
			queries[item].expectFunction(res);
		}
		else {
			expect(JSON.parse(res.body).data[item]).to.deep.equal(queries[item].expect);
		}
	});
}

function testMutations(item) {
	it(item + ' mutation testing', async () => {
		const mutationRequest = new Connect();
		mutationRequest.post();
		mutationRequest.url('http://localhost:5000/api').cookies(true);
		mutationRequest.body({
			query: mutations[item].mutation,
		});

		const mutationResponse = await mutationRequest;
		if (mutationResponse.statusCode === 500) mutationResponse;
		expect(mutationResponse.statusCode).to.equal(200);

		if (item === 'mailReview' || item === 'replyReview') {
			const rejected = JSON.parse(mutationResponse.body).data[item].rejected;
			expect(rejected).to.be.empty;
			return;
		}

		const id = JSON.parse(mutationResponse.body).data[item].id;
		if (!id) return;

		const queryRequest = new Connect();
		queryRequest.post();
		queryRequest.url('http://localhost:5000/api');
		queryRequest.body({
			query: mutations[item].query(id),
		});
		const queryResponse = await queryRequest;
		expect(queryResponse.statusCode).to.equal(200);
		expect(JSON.parse(queryResponse.body).data).to.deep.equal(mutations[item].expect);
	}).timeout(8000);
}

describe('API testing', () => {
	describe('Queries testing', () => {
		// eslint-disable-next-line guard-for-in
		for (const item in queries) {
			testQueries(item);
		}
	});

	describe('Mutations testing', () => {
		// eslint-disable-next-line guard-for-in
		for (const item in mutations) {
			testMutations(item);
		}
	});
});
