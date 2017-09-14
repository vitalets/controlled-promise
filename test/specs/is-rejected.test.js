describe('isRejected', function () {
  it('should be false on new instance', function () {
    assert.notOk(this.cp.isRejected);
  });

  it('should be false after call', function () {
    this.cp.call();
    assert.notOk(this.cp.isRejected);
  });

  it('should be true after manual reject', function () {
    const p = this.cp.call();
    this.cp.reject();
    return assert.isRejected(p)
      .then(() => assert.ok(this.cp.isRejected));
  });

  it('should be true after reject by error in fn', function () {
    const p = this.cp.call(() => {
      throw new Error('err');
    });
    return assert.isRejected(p)
      .then(() => assert.ok(this.cp.isRejected));
  });

  it('should be true after resolve with rejected promise', function () {
    const p = this.cp.call();
    this.cp.resolve(Promise.reject('err'));
    return assert.isRejected(p)
      .then(() => assert.ok(this.cp.isRejected));
  });
});
