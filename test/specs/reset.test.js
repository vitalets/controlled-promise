describe('reset', function () {
  it('should reset resolved promise', function () {
    this.cp.call();
    this.cp.resolve();
    this.cp.reset();
    assert.equal(this.cp.isPending, false);
    assert.equal(this.cp.isPending, false);
  });

  it('should reject pending promise', async function () {
    const p = this.cp.call(noop);
    this.cp.reset();
    await assertRejected(p, 'Promise rejected by reset');
    // assert.equal(this.cp.isRejected, false);
  });
});
