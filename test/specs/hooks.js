const ControlledPromise = require(process.env.TEST_LIB ? '../../lib' : '../../src');

beforeEach(function () {
  this.cp = new ControlledPromise();
});
