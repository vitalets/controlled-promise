describe('call', function () {
  beforeEach(function () {
    this.cp = createControlledPromise();
  });

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
    return assert.isFulfilled(p1)
      .then(() => {
        const p2 = this.cp.call(noop);
        assert.notEqual(p1, p2);
      });
  });

  it('should return new promise for call after reject', function () {
    const p1 = this.cp.call(noop);
    this.cp.reject();
    return assert.isRejected(p1)
      .then(() => {
        const p2 = this.cp.call(noop);
        assert.notEqual(p1, p2);
      });
  });

  it('should return new promise for call after reset', function () {
    const p1 = this.cp.call(noop);
    p1.catch(() => {
    });
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
