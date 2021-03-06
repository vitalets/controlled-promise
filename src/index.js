/**
 * Controlled Promise.
 */

class ControlledPromise {
  /**
   * Creates controlled promise. In contrast to original Promise, it does not immediately call any function.
   * Instead it has [.call()](#ControlledPromise+call) method for that and `resolve / reject` methods for
   * resolving promise.
   */
  constructor() {
    this._resolve = null;
    this._reject = null;
    this._isPending = false;
    this._isFulfilled = false;
    this._isRejected = false;
    this._value = undefined;
    this._promise = null;
    this._timer = null;
    this._timeout = 0;
    this._timeoutReason = 'Promise rejected by timeout';
    this._resetReason = 'Promise rejected by reset';
  }

  /**
   * Returns promise itself.
   *
   * @returns {Promise}
   */
  get promise() {
    return this._promise;
  }

  /**
   * Returns value with that promise was fulfilled (resolved or rejected).
   *
   * @returns {*}
   */
  get value() {
    return this._value;
  }

  /**
   * Returns true if promise is pending.
   *
   * @returns {Boolean}
   */
  get isPending() {
    return this._isPending;
  }

  /**
   * Returns true if promise is fulfilled.
   *
   * @returns {Boolean}
   */
  get isFulfilled() {
    return this._isFulfilled;
  }

  /**
   * Returns true if promise rejected.
   *
   * @returns {Boolean}
   */
  get isRejected() {
    return this._isRejected;
  }

  /**
   * Returns true if promise fulfilled or rejected.
   *
   * @returns {Boolean}
   */
  get isSettled() {
    return this._isFulfilled || this._isRejected;
  }

  /**
   * Returns true if promise already called via `.call()` method.
   *
   * @returns {Boolean}
   */
  get isCalled() {
    return this.isPending || this.isSettled;
  }

  /**
   * This method executes `fn` and returns promise. While promise is pending all subsequent calls of `.call(fn)`
   * will return the same promise. To fulfill that promise you can use `.resolve() / .reject()` methods.
   *
   * @param {Function} fn
   * @returns {Promise}
   */
  call(fn) {
    if (!this._isPending) {
      this.reset();
      this._createPromise();
      this._createTimer();
      this._callFn(fn);
    }
    return this._promise;
  }

  /**
   * Resolves pending promise with specified `value`.
   *
   * @param {*} [value]
   */
  resolve(value) {
    if (this._isPending) {
      if (isPromise(value)) {
        this._tryAttachToPromise(value);
      } else {
        this._settle(value);
        this._isFulfilled = true;
        this._resolve(value);
      }
    }
  }

  /**
   * Rejects pending promise with specified `value`.
   *
   * @param {*} [value]
   */
  reject(value) {
    if (this._isPending) {
      this._settle(value);
      this._isRejected = true;
      this._reject(value);
    }
  }

  /**
   * Resets to initial state.
   */
  reset() {
    if (this._isPending) {
      this.reject(new Error(this._resetReason));
    }
    this._promise = null;
    this._isPending = false;
    this._isFulfilled = false;
    this._isRejected = false;
    this._value = undefined;
    this._clearTimer();
  }

  /**
   * Sets timeout to reject promise automatically.
   *
   * @param {Number} ms delay in ms after that promise will be rejected automatically
   * @param {String|Error|Function} [reason] rejection value. If it is string or error - promise will be rejected with
   * that error. If it is function - this function will be called after delay where you can manually resolve or reject
   * promise via `.resolve() / .reject()` methods.
   */
  timeout(ms, reason) {
    this._timeout = ms;
    if (reason !== undefined) {
      this._timeoutReason = reason;
    }
  }

  _createPromise() {
    this._promise = new Promise((resolve, reject) => {
      this._isPending = true;
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  _handleTimeout() {
    if (typeof this._timeoutReason === 'function') {
      this._timeoutReason();
    } else {
      const error = typeof this._timeoutReason === 'string'
        ? new Error(this._timeoutReason)
        : this._timeoutReason;
      this.reject(error);
    }
  }

  _createTimer() {
    if (this._timeout) {
      this._timer = setTimeout(() => this._handleTimeout(), this._timeout);
    }
  }

  _clearTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  _settle(value) {
    this._isPending = false;
    this._value = value;
    this._clearTimer();
  }

  _callFn(fn) {
    if (typeof fn === 'function') {
      try {
        const result = fn();
        this._tryAttachToPromise(result);
      } catch (e) {
        this.reject(e);
      }
    }
  }

  _tryAttachToPromise(p) {
    if (isPromise(p)) {
      p.then(value => this.resolve(value), e => this.reject(e));
    }
  }
}

function isPromise(p) {
  return p && typeof p.then === 'function';
}

module.exports = ControlledPromise;
