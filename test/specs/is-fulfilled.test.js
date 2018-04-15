describe('isFulfilled', function () {
  it('should be false on new instance', function () {
    assert.notOk(this.cp.isFulfilled);
  });

  it('should be false after call', function () {
    this.cp.call();
    assert.notOk(this.cp.isFulfilled);
  });

  it('should be true after resolve with non promise', async function () {
    const p = this.cp.call();
    this.cp.resolve('foo');
    await p;
    assert.ok(this.cp.isFulfilled);
  });

  it('should be false after resolve with pending promise', async function () {
    this.cp.call();
    this.cp.resolve(new Promise(noop));
    await wait(10);
    assert.notOk(this.cp.isFulfilled);
  });
});
