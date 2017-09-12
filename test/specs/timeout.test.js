describe('timeout', function () {
  beforeEach(function () {
    this.cp = createControlledPromise();
  });

  it('should resolve before timeout', function () {
    this.cp.timeout(10);
    const res = this.cp.call(noop);
    setTimeout(() => this.cp.resolve('foo'), 5);
    return assert.eventually.equal(res, 'foo');
  });

  it('should reject after timeout', function () {
    this.cp.timeout(10);
    const res = this.cp.call(noop);
    res.catch(noop);
    setTimeout(() => this.cp.resolve('foo'), 20);
    return assert.isRejected(res, 'Promise rejected by timeout');
  });

  it('should reject after timeout with custom error', function () {
    this.cp.timeout(1, 'err');
    const res = this.cp.call(noop);
    res.catch(noop);
    return wait(5).then(() => assert.isRejected(res, 'err'));
  });

  it('should call custom fn after timeout', function () {
    this.cp.timeout(1, () => this.cp.resolve('foo'));
    const res = this.cp.call(noop);
    return wait(5).then(() => assert.eventually.equal(res, 'foo'));
  });
});
