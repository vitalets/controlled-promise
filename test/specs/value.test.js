describe('value', function () {
  it('should return resolved value', function () {
    const p = this.cp.call();
    this.cp.resolve('foo');
    return assert.isFulfilled(p)
      .then(() => assert.equal(this.cp.value, 'foo'));
  });

  it('should return rejected value', function () {
    const p = this.cp.call();
    this.cp.reject('err');
    return assert.isRejected(p)
      .then(() => assert.equal(this.cp.value, 'err'));
  });
});
