import lodash from 'lodash';
import {Moment} from 'moment';
import {cfg as cfgType} from 'sm-utils';
import dType from 'sm-utils/d';

/**
 * For bluebird promise we are using '@types/bluebird-global'
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/354cec6/types/bluebird-global/index.d.ts#L12
 */

 declare global {
	const _ : typeof lodash;
	const moment : Moment;
	const cfg: typeof cfgType;
	const d: typeof dType;
}
