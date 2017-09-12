// describe('constructor options: timeout', function () {
//   it('should resolve before timeout', function () {
//     this.cp = new Pending({timeout: 10});
//     const res = this.cp.call(noop);
//     setTimeout(() => this.cp.resolve('foo'), 5);
//     return assert.eventually.equal(res, 'foo');
//   });
//
//   it('should reject after timeout', function () {
//     this.cp = new Pending({timeout: 10});
//     const res = this.cp.call(noop);
//     setTimeout(() => this.cp.resolve('foo'), 20);
//     return assert.isRejected(res, 'Promise rejected by timeout (10 ms)');
//   });
// });

// describe('call options: timeout', function () {
//   it('should resolve before timeout', function () {
//     const res = this.cp.call(noop, {timeout: 10});
//     setTimeout(() => this.cp.resolve('foo'), 5);
//     return assert.eventually.equal(res, 'foo');
//   });
//
//   it('should reject after timeout', function () {
//     const res = this.cp.call(noop, {timeout: 10});
//     setTimeout(() => this.cp.resolve('foo'), 20);
//     return assert.isRejected(res, 'Promise rejected by timeout (10 ms)');
//   });
//
//   it('should overwrite default timeout', function () {
//     this.cp = new Pending({timeout: 10});
//     const res = this.cp.call(noop, {timeout: 20});
//     setTimeout(() => this.cp.resolve('foo'), 15);
//     return assert.eventually.equal(res, 'foo');
//   });
//
//   it('should not overwrite default timeout with undefined', function () {
//     this.cp = new Pending({timeout: 10});
//     const res = this.cp.call(noop, {timeout: undefined});
//     setTimeout(() => this.cp.resolve('foo'), 5);
//     return assert.eventually.equal(res, 'foo');
//   });
// });
