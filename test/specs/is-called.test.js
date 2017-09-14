describe('isCalled', function () {
  it('should be false on new instance', function () {
    assert.notOk(this.cp.isCalled);
  });

  it('should be true after call', function () {
    this.cp.call();
    assert.ok(this.cp.isCalled);
  });

  it('should be true after fulfill', function () {
    const p = this.cp.call();
    this.cp.resolve();
    return assert.isFulfilled(p)
      .then(() => assert.ok(this.cp.isCalled));
  });

  it('should be true after reject', function () {
    const p = this.cp.call();
    this.cp.reject();
    return assert.isRejected(p)
      .then(() => assert.ok(this.cp.isCalled));
  });

  it('should be false after reset', function () {
    this.cp.call().catch(noop);
    this.cp.reset();
    assert.notOk(this.cp.isCalled);
  });
});
