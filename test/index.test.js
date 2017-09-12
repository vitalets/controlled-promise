'use strict';

const ControlledPromise = require(`${srcPath}`);

const noop = () => {};

describe('ControlledPromise', function () {
  beforeEach(function () {
    this.cp = new ControlledPromise();
  });

  describe.only('call', function () {
    it('should return Promise', function () {
      const res = this.cp.call(noop);
      assert.instanceOf(res, Promise);
    });

    it('should store Promise', function () {
      const res = this.cp.call(noop);
      assert.instanceOf(this.cp.promise, Promise);
      assert.equal(res, this.cp.promise);
    });

    it('should call passed fn', function () {
      let a = 0;
      this.cp.call(() => a++);
      assert.equal(a, 1);
    });

    it('should return the same promise if it is pending', function () {
      const p1 = this.cp.call(noop);
      const p2 = this.cp.call(noop);
      assert.equal(p1, p2);
    });

    it('should return new promise for call after resolve', function () {
      const p1 = this.cp.call(noop);
      this.cp.resolve();
      const p2 = this.cp.call(noop);
      assert.notEqual(p1, p2);
    });

    it('should return new promise for call after reject', function () {
      const p1 = this.cp.call(noop);
      this.cp.reject();
      const p2 = this.cp.call(noop);
      assert.notEqual(p1, p2);
    });

    it('should return new promise for call after resolve + reset', function () {
      const p1 = this.cp.call(noop);
      this.cp.resolve();
      this.cp.reset();
      const p2 = this.cp.call(noop);
      assert.notEqual(p1, p2);
    });

    it('should return new promise for call after reject + reset', function () {
      const p1 = this.cp.call(noop);
      this.cp.reject();
      this.cp.reset();
      const p2 = this.cp.call(noop);
      assert.notEqual(p1, p2);
    });

    it('should allow to call without fn', function () {
      const res = this.cp.call();
      this.cp.resolve('foo');
      return assert.eventually.equal(res, 'foo');
    });

    it('should attach to promise returned by fn (resolve)', function () {
      const res = this.cp.call(() => Promise.resolve('foo'));
      return assert.eventually.equal(res, 'foo');
    });

    it('should attach to promise returned by fn (reject)', function () {
      const res = this.cp.call(() => Promise.reject(new Error('err')));
      return assert.isRejected(res, 'err');
    });
  });

  describe('resolve', function () {
    it('should resolve directly', function () {
      const res = this.pending.call(noop);
      this.pending.resolve('foo');
      return assert.eventually.equal(res, 'foo');
    });

    it('should resolve inside fn', function () {
      const res = this.pending.call(() => this.pending.resolve('foo'));
      return assert.eventually.equal(res, 'foo');
    });

    it('should keep first value if resolved twice', function () {
      const res = this.pending.call(noop);
      this.pending.resolve('foo');
      this.pending.resolve('bar');
      return assert.eventually.equal(res, 'foo');
    });

    it('should do nothing for resolve without call', function () {
      assert.doesNotThrow(() => this.pending.resolve('foo'));
    });
  });

  describe('reject', function () {
    it('should reject in case of error in fn', function () {
      const res = this.pending.call(() => {
        throw new Error('err');
      });
      return assert.isRejected(res, 'err');
    });

    it('should reject directly', function () {
      const res = this.pending.call(noop);
      this.pending.reject(new Error('err'));
      return assert.isRejected(res, 'err');
    });

    it('should reject inside fn', function () {
      const res = this.pending.call(() => this.pending.reject(new Error('err')));
      return assert.isRejected(res, 'err');
    });

    it('should keep first value if rejected twice', function () {
      const res = this.pending.call(noop);
      this.pending.reject(new Error('foo'));
      this.pending.reject(new Error('bar'));
      return assert.isRejected(res, 'foo');
    });

    it('should do nothing for reject without call', function () {
      assert.doesNotThrow(() => this.pending.reject('foo'));
    });
  });

  describe('fulfill', function () {
    it('should resolve', function () {
      const res = this.pending.call(noop);
      this.pending.fulfill('foo');
      return assert.eventually.equal(res, 'foo');
    });

    it('should reject with error', function () {
      const res = this.pending.call(noop);
      this.pending.fulfill('foo', new Error('err'));
      return assert.isRejected(res, 'err');
    });

    it('should keep first value if fulfilled twice', function () {
      const res = this.pending.call(noop);
      this.pending.fulfill('foo');
      this.pending.fulfill('bar', new Error('err'));
      return assert.eventually.equal(res, 'foo');
    });
  });

  describe('isPending', function () {
    it('should be false until call', function () {
      assert.notOk(this.pending.isPending);
    });

    it('should be true after call', function () {
      this.pending.call();
      assert.ok(this.pending.isPending);
    });

    it('should be false after resolve', function () {
      this.pending.call();
      this.pending.resolve('foo');
      assert.notOk(this.pending.isPending);
    });

    it('should be false after reject', function () {
      this.pending.call().catch(() => {});
      this.pending.reject('foo');
      assert.notOk(this.pending.isPending);
    });
  });

  describe('isFulfilled', function () {
    it('should set after resolve', function () {
      assert.notOk(this.pending.isFulfilled);
      this.pending.call();
      assert.notOk(this.pending.isFulfilled);
      this.pending.resolve('foo');
      assert.ok(this.pending.isFulfilled);
    });

    it('should set after manual reject', function () {
      assert.notOk(this.pending.isFulfilled);
      const res = this.pending.call();
      assert.notOk(this.pending.isFulfilled);
      this.pending.reject('foo');
      assert.ok(this.pending.isFulfilled);
      return assert.isRejected(res, 'foo');
    });

    it('should set after reject by error in fn', function () {
      assert.notOk(this.pending.isFulfilled);
      const res = this.pending.call(() => {
        throw new Error('err');
      });
      assert.ok(this.pending.isFulfilled);
      return assert.isRejected(res, 'err');
    });
  });

  describe('onFulfilled', function () {
    it('should call after resolve', function () {
      let a = 0;
      this.pending.onFulfilled = () => a++;
      this.pending.call();
      this.pending.resolve('foo');
      assert.equal(a, 1);
    });

    it('should set after reject', function () {
      let a = 0;
      this.pending.onFulfilled = () => a++;
      this.pending.call().catch(noop);
      this.pending.reject('foo');
      assert.equal(a, 1);
    });

    it('should set after reject (by error in fn)', function () {
      let a = 0;
      this.pending.onFulfilled = () => a++;
      this.pending.call(() => { throw new Error('err'); }).catch(noop);
      assert.equal(a, 1);
    });
  });

  describe('reset', function () {
    it('should reset resolved promise', function () {
      this.pending.call();
      this.pending.resolve();
      this.pending.reset();
      assert.equal(this.pending.isResolved, false);
    });

    it('should reject pending promise', function () {
      const res = this.pending.call(noop);
      this.pending.reset();
      return assert.isRejected(res, 'Promise rejected by reset');
    });

    it('should reject pending promise with custom message', function () {
      const res = this.pending.call(noop);
      this.pending.reset(new Error('err'));
      return assert.isRejected(res, 'err');
    });
  });

  describe('value', function () {
    it('should return resolved value', function () {
      this.pending.call();
      this.pending.resolve('foo');
      assert.equal(this.pending.value, 'foo');
    });

    it('should return rejected value', function () {
      this.pending.call().catch(() => {});
      this.pending.reject('err');
      assert.equal(this.pending.value, 'err');
    });
  });

  describe('constructor options: timeout', function () {
    it('should resolve before timeout', function () {
      this.pending = new Pending({timeout: 10});
      const res = this.pending.call(noop);
      setTimeout(() => this.pending.resolve('foo'), 5);
      return assert.eventually.equal(res, 'foo');
    });

    it('should reject after timeout', function () {
      this.pending = new Pending({timeout: 10});
      const res = this.pending.call(noop);
      setTimeout(() => this.pending.resolve('foo'), 20);
      return assert.isRejected(res, 'Promise rejected by timeout (10 ms)');
    });
  });

  describe('call options: timeout', function () {
    it('should resolve before timeout', function () {
      const res = this.pending.call(noop, {timeout: 10});
      setTimeout(() => this.pending.resolve('foo'), 5);
      return assert.eventually.equal(res, 'foo');
    });

    it('should reject after timeout', function () {
      const res = this.pending.call(noop, {timeout: 10});
      setTimeout(() => this.pending.resolve('foo'), 20);
      return assert.isRejected(res, 'Promise rejected by timeout (10 ms)');
    });

    it('should overwrite default timeout', function () {
      this.pending = new Pending({timeout: 10});
      const res = this.pending.call(noop, {timeout: 20});
      setTimeout(() => this.pending.resolve('foo'), 15);
      return assert.eventually.equal(res, 'foo');
    });

    it('should not overwrite default timeout with undefined', function () {
      this.pending = new Pending({timeout: 10});
      const res = this.pending.call(noop, {timeout: undefined});
      setTimeout(() => this.pending.resolve('foo'), 5);
      return assert.eventually.equal(res, 'foo');
    });
  });

  describe('constructor options: autoReset', function () {
    describe('never', function () {
      it('should keep promise on next calls after resolve', function () {
        this.pending = new Pending({autoReset: 'never'});
        const p = this.pending.call();
        this.pending.resolve();
        assert.equal(p, this.pending.call());
      });

      it('should keep promise on next calls after reject', function () {
        this.pending = new Pending({autoReset: 'never'});
        const p = this.pending.call();
        p.catch(() => {});
        this.pending.reject();
        assert.equal(p, this.pending.call());
      });
    });

    describe('resolved', function () {
      it('should not keep promise on next calls after resolve', function () {
        this.pending = new Pending({autoReset: 'resolved'});
        const p = this.pending.call();
        this.pending.resolve();
        assert.notEqual(p, this.pending.call());
      });

      it('should keep promise on next calls after reject', function () {
        this.pending = new Pending({autoReset: 'resolved'});
        const p = this.pending.call();
        p.catch(() => {});
        this.pending.reject();
        assert.equal(p, this.pending.call());
      });
    });

    describe('rejected', function () {
      it('should keep promise on next calls after resolve', function () {
        this.pending = new Pending({autoReset: 'rejected'});
        const p = this.pending.call();
        this.pending.resolve();
        assert.equal(p, this.pending.call());
      });

      it('should not keep promise on next calls after reject', function () {
        this.pending = new Pending({autoReset: 'rejected'});
        const p = this.pending.call();
        p.catch(() => {});
        this.pending.reject();
        assert.notEqual(p, this.pending.call());
      });
    });

    describe('fulfilled', function () {
      it('should not keep promise on next calls after resolve', function () {
        this.pending = new Pending({autoReset: 'fulfilled'});
        const p = this.pending.call();
        this.pending.resolve();
        assert.notEqual(p, this.pending.call());
      });

      it('should not keep promise on next calls after reject', function () {
        this.pending = new Pending({autoReset: 'fulfilled'});
        const p = this.pending.call();
        p.catch(() => {});
        this.pending.reject();
        assert.notEqual(p, this.pending.call());
      });
    });

  });
});
