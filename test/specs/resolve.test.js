describe('resolve', function () {
  it('should resolve directly', function () {
    const res = this.cp.call(noop);
    this.cp.resolve('foo');
    return assert.eventually.equal(res, 'foo');
  });

  it('should resolve inside fn', function () {
    const res = this.cp.call(() => this.cp.resolve('foo'));
    return assert.eventually.equal(res, 'foo');
  });

  it('should keep first value if resolved twice', function () {
    const res = this.cp.call(noop);
    this.cp.resolve('foo');
    this.cp.resolve('bar');
    return assert.eventually.equal(res, 'foo');
  });

  it('should do nothing for resolve without call', function () {
    assert.doesNotThrow(() => this.cp.resolve('foo'));
  });
});
