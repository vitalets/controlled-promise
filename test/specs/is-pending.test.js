describe('isPending', function () {
  beforeEach(function () {
    this.cp = createControlledPromise();
  });

  it('should be false on new instance', function () {
    assert.notOk(this.cp.isPending);
  });

  it('should be true after call', function () {
    this.cp.call();
    assert.ok(this.cp.isPending);
  });

  it('should be false after fulfill', function () {
    const p = this.cp.call();
    this.cp.resolve('foo');
    return assert.isFulfilled(p)
      .then(() => assert.notOk(this.cp.isPending));
  });

  it('should be true after resolve with pending promise', function () {
    this.cp.call();
    this.cp.resolve(new Promise(noop));
    return wait(10).then(() => assert.ok(this.cp.isPending));
  });

  it('should be false after reject', function () {
    const p = this.cp.call();
    this.cp.reject('foo');
    return assert.isRejected(p)
      .then(() => assert.notOk(this.cp.isPending));
  });
});
