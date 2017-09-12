describe('reset', function () {
  beforeEach(function () {
    this.cp = createControlledPromise();
  });

  it('should reset resolved promise', function () {
    this.cp.call();
    this.cp.resolve();
    this.cp.reset();
    assert.equal(this.cp.isPending, false);
    assert.equal(this.cp.isPending, false);
  });

  it('should reject pending promise', function () {
    const p = this.cp.call(noop);
    this.cp.reset();
    return assert.isRejected(p, 'Promise rejected by reset');
  });
});
