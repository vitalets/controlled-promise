const chai = require('chai');

global.assert = chai.assert;
global.noop = () => {};
global.wait = ms => new Promise(r => setTimeout(r, ms));
global.safeReject = promise => promise.catch(() => {});
global.assertRejected = async (promise, err) => {
  let f = () => { };
  let catched = false;
  try {
    await promise;
  } catch (e) {
    catched = true;
    f = () => { throw e; };
  } finally {
    const checkRejectedValue = err !== undefined || !catched;
    if (checkRejectedValue) {
      assert.throws(f, err);
    }
  }
};

