'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

global.assert = chai.assert;
global.expect = chai.expect;
global.srcPath = process.env.TEST_LIB ? '../../lib' : '../../src';

// see: https://github.com/domenic/chai-as-promised/issues/173
process.on('unhandledRejection', () => {});
