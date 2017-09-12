describe('isFulfilled', function () {
  beforeEach(function () {
    this.cp = createControlledPromise();
  });

  it('should be false on new instance', function () {
    assert.notOk(this.cp.isFulfilled);
  });

  it('should be false after call', function () {
    this.cp.call();
    assert.notOk(this.cp.isFulfilled);
  });

  it('should be true after resolve with non promise', function () {
    const p = this.cp.call();
    this.cp.resolve('foo');
    return assert.isFulfilled(p)
      .then(() => assert.ok(this.cp.isFulfilled));
  });

  it('should be false after resolve with pending promise', function () {
    this.cp.call();
    this.cp.resolve(new Promise(noop));
    return wait(10).then(() => assert.notOk(this.cp.isFulfilled));
  });
});
