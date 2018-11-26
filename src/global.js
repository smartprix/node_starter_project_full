import _ from 'lodash';
import moment from 'moment';
import Promise from 'bluebird';
import {cfg} from 'sm-utils';
import d from 'sm-utils/d';
import './objection';

global.d = d;
global._ = _;
global.moment = moment;
global.Promise = Promise;
global.cfg = cfg;


let env = process.env.NODE_ENV;
if (!['production', 'test', 'staging'].includes(env)) {
	env = 'development';
	process.env.NODE_ENV = env;
}
