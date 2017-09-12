describe('reject', function () {
  beforeEach(function () {
    this.cp = createControlledPromise();
  });

  it('should reject in case of error in fn', function () {
    const res = this.cp.call(() => {
      throw new Error('err');
    });
    return assert.isRejected(res, 'err');
  });

  it('should reject directly', function () {
    const res = this.cp.call(noop);
    this.cp.reject(new Error('err'));
    return assert.isRejected(res, 'err');
  });

  it('should reject inside fn', function () {
    const res = this.cp.call(() => this.cp.reject(new Error('err')));
    return assert.isRejected(res, 'err');
  });

  it('should keep first value if rejected twice', function () {
    const res = this.cp.call(noop);
    this.cp.reject(new Error('foo'));
    this.cp.reject(new Error('bar'));
    return assert.isRejected(res, 'foo');
  });

  it('should do nothing for reject without call', function () {
    assert.doesNotThrow(() => this.cp.reject('foo'));
  });
});
