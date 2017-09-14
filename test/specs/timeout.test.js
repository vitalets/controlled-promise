describe('timeout', function () {
  it('should resolve before timeout', function () {
    this.cp.timeout(10);
    const res = this.cp.call();
    setTimeout(() => this.cp.resolve('foo'), 5);
    return assert.eventually.equal(res, 'foo');
  });

  it('should reject after timeout', function () {
    this.cp.timeout(10);
    const res = this.cp.call();
    res.catch(noop);
    setTimeout(() => this.cp.resolve('foo'), 20);
    return assert.isRejected(res, 'Promise rejected by timeout');
  });

  it('should reject after timeout with custom error', function () {
    this.cp.timeout(1, 'err');
    const res = this.cp.call();
    res.catch(noop);
    return wait(5).then(() => assert.isRejected(res, 'err'));
  });

  it('should call custom fn after timeout', function () {
    this.cp.timeout(1, () => this.cp.resolve('foo'));
    const res = this.cp.call();
    return wait(5).then(() => assert.eventually.equal(res, 'foo'));
  });

  it('should not call custom fn if resolved', function () {
    let a = 0;
    this.cp.timeout(5, () => a++);
    this.cp.call();
    this.cp.resolve();
    return wait(10).then(() => assert.equal(a, 0));
  });

  it('should not call custom fn if rejected', function () {
    let a = 0;
    this.cp.timeout(5, () => a++);
    this.cp.call().catch(noop);
    this.cp.reject();
    return wait(10).then(() => assert.equal(a, 0));
  });

  it('should not call custom fn if rejected in fn', function () {
    let a = 0;
    this.cp.timeout(5, () => a++);
    this.cp.call(() => {throw new Error('err');}).catch(noop);
    return wait(10).then(() => assert.equal(a, 0));
  });
});
