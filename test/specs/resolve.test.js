describe('resolve', function () {
  it('should resolve directly', async function () {
    const p = this.cp.call(noop);
    this.cp.resolve('foo');
    // assert.equal(this.cp.isFulfilled, true);
    assert.equal(await p, 'foo');
  });

  it('should resolve inside fn', async function () {
    const p = this.cp.call(() => this.cp.resolve('foo'));
    assert.equal(await p, 'foo');
  });

  it('should keep first value if resolved twice', async function () {
    const p = this.cp.call(noop);
    this.cp.resolve('foo');
    this.cp.resolve('bar');
    assert.equal(await p, 'foo');
  });

  it('should do nothing for resolve without call', function () {
    assert.doesNotThrow(() => this.cp.resolve('foo'));
  });
});
