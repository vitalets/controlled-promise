describe('isSettled', function () {
  it('should be false on new instance', function () {
    assert.notOk(this.cp.isSettled);
  });

  it('should be false after call', function () {
    this.cp.call();
    assert.notOk(this.cp.isSettled);
  });

  it('should be true after fulfill', function () {
    const p = this.cp.call();
    this.cp.resolve();
    return assert.isFulfilled(p)
      .then(() => assert.ok(this.cp.isSettled));
  });

  it('should be true after reject', function () {
    const p = this.cp.call();
    this.cp.reject();
    return assert.isRejected(p)
      .then(() => assert.ok(this.cp.isSettled));
  });
});
