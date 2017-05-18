/* eslint-disable no-extend-native */
import {
	keys,
	values,
	entries,
	assign,
	isArray,
	includes,
	find,
	findIndex,
	trim,
	filter,
	forEach,
	pick,
} from 'lodash';

Object.assign = Object.assign || assign;
Object.keys = Object.keys || keys;
Object.values = Object.values || values;
Object.entries = Object.entries || entries;
Array.isArray = Array.isArray || isArray;
Array.prototype.includes = Array.prototype.includes ||
	function (a) { return includes(this, a) };
Array.prototype.find = Array.prototype.find ||
	function (a) { return find(this, a) };
Array.prototype.findIndex = Array.prototype.findIndex ||
	function (a) { return findIndex(this, a) };

export {
	keys,
	values,
	entries,
	assign,
	isArray,
	includes,
	find,
	findIndex,
	trim,
	filter,
	forEach,
	pick,
};
