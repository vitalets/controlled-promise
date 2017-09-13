const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const ControlledPromise = require(process.env.TEST_LIB ? '../lib' : '../src');

chai.use(chaiAsPromised);

global.createControlledPromise = () => new ControlledPromise();
global.assert = chai.assert;
global.noop = () => {};
global.wait = ms => new Promise(r => setTimeout(r, ms));
