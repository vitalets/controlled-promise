# controlled-promise

[![Build Status](https://travis-ci.org/vitalets/controlled-promise.svg?branch=master)](https://travis-ci.org/vitalets/controlled-promise)
[![npm](https://img.shields.io/npm/v/controlled-promise.svg)](https://www.npmjs.com/package/controlled-promise)
[![license](https://img.shields.io/npm/l/controlled-promise.svg)](https://www.npmjs.com/package/controlled-promise)

> Better control of JavaScript [Promises]

A [Promise]-wrapping library providing advanced control of promise lifecycle. 
It is especially useful for dealing with promises in event-based code.
*ControlledPromise* allows to split out promise manipulation from business logic. It has tiny size and no dependencies.

## Installation
```bash
npm install controlled-promise --save
```

## Features
* provides access to `resolve` / `reject` callbacks when you need them
* returns existing promise on all subsequent calls until promise is fulfilled / rejected
* automatically rejects promise after configured `timeout`

## Usage
Typical situation with promises in event-based code:
```js
class Foo {
    constructor() {
      this.promise = null;
      this.resolve = null;
      this.reject = null;
    }
    asyncRequest() {
        if (this.promise) { // if promise already exists - return it
            return this.promise;
        }
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve; // store callbacks for future fulfillment
            this.reject = reject;
            this.send({foo: 'bar'});
        });
        return this.promise;
    }
    onSuccess(response) {
        this.resolve(response); // resolve promise when 'success' event comes
        this.promise = null;
    }
}    
```    
The same class with [ControlledPromise](#ControlledPromise) is actually 3 lines of code:   
```js
const ControlledPromise = require('controlled-promise');

class Foo {
    constructor() {
        this.request = new ControlledPromise();
    }
    asyncRequest() { 
        return this.request.call(() => this.send({foo: 'bar'}));
    }
    onSuccess(response) {
        this.request.resolve(response);
    }
}
```

## API

<a name="ControlledPromise"></a>

## ControlledPromise
Controlled Promise.

**Kind**: global class  

* [ControlledPromise](#ControlledPromise)
    * [new ControlledPromise()](#new_ControlledPromise_new)
    * [.promise](#ControlledPromise+promise) ⇒ <code>Promise</code>
    * [.value](#ControlledPromise+value) ⇒ <code>\*</code>
    * [.isPending](#ControlledPromise+isPending) ⇒ <code>Boolean</code>
    * [.isFulfilled](#ControlledPromise+isFulfilled) ⇒ <code>Boolean</code>
    * [.isRejected](#ControlledPromise+isRejected) ⇒ <code>Boolean</code>
    * [.isSettled](#ControlledPromise+isSettled) ⇒ <code>Boolean</code>
    * [.isCalled](#ControlledPromise+isCalled) ⇒ <code>Boolean</code>
    * [.call(fn)](#ControlledPromise+call) ⇒ <code>Promise</code>
    * [.resolve([value])](#ControlledPromise+resolve)
    * [.reject([value])](#ControlledPromise+reject)
    * [.reset()](#ControlledPromise+reset)
    * [.timeout(ms, [reason])](#ControlledPromise+timeout)

<a name="new_ControlledPromise_new"></a>

### new ControlledPromise()
Creates controlled promise. In contrast to original Promise, it does not immediately call any function.
Instead it has [.call()](#ControlledPromise+call) method for that and `resolve / reject` methods for
resolving promise.

<a name="ControlledPromise+promise"></a>

### controlledPromise.promise ⇒ <code>Promise</code>
Returns promise itself.

**Kind**: instance property of [<code>ControlledPromise</code>](#ControlledPromise)  
<a name="ControlledPromise+value"></a>

### controlledPromise.value ⇒ <code>\*</code>
Returns value with that promise was fulfilled (resolved or rejected).

**Kind**: instance property of [<code>ControlledPromise</code>](#ControlledPromise)  
<a name="ControlledPromise+isPending"></a>

### controlledPromise.isPending ⇒ <code>Boolean</code>
Returns true if promise is pending.

**Kind**: instance property of [<code>ControlledPromise</code>](#ControlledPromise)  
<a name="ControlledPromise+isFulfilled"></a>

### controlledPromise.isFulfilled ⇒ <code>Boolean</code>
Returns true if promise is fulfilled.

**Kind**: instance property of [<code>ControlledPromise</code>](#ControlledPromise)  
<a name="ControlledPromise+isRejected"></a>

### controlledPromise.isRejected ⇒ <code>Boolean</code>
Returns true if promise rejected.

**Kind**: instance property of [<code>ControlledPromise</code>](#ControlledPromise)  
<a name="ControlledPromise+isSettled"></a>

### controlledPromise.isSettled ⇒ <code>Boolean</code>
Returns true if promise fulfilled or rejected.

**Kind**: instance property of [<code>ControlledPromise</code>](#ControlledPromise)  
<a name="ControlledPromise+isCalled"></a>

### controlledPromise.isCalled ⇒ <code>Boolean</code>
Returns true if promise already called via `.call()` method.

**Kind**: instance property of [<code>ControlledPromise</code>](#ControlledPromise)  
<a name="ControlledPromise+call"></a>

### controlledPromise.call(fn) ⇒ <code>Promise</code>
This method executes `fn` and returns promise. While promise is pending all subsequent calls of `.call(fn)`
will return the same promise. To fulfill that promise you can use `.resolve() / .reject()` methods.

**Kind**: instance method of [<code>ControlledPromise</code>](#ControlledPromise)  

| Param | Type |
| --- | --- |
| fn | <code>function</code> | 

<a name="ControlledPromise+resolve"></a>

### controlledPromise.resolve([value])
Resolves pending promise with specified `value`.

**Kind**: instance method of [<code>ControlledPromise</code>](#ControlledPromise)  

| Param | Type |
| --- | --- |
| [value] | <code>\*</code> | 

<a name="ControlledPromise+reject"></a>

### controlledPromise.reject([value])
Rejects pending promise with specified `value`.

**Kind**: instance method of [<code>ControlledPromise</code>](#ControlledPromise)  

| Param | Type |
| --- | --- |
| [value] | <code>\*</code> | 

<a name="ControlledPromise+reset"></a>

### controlledPromise.reset()
Resets to initial state.

**Kind**: instance method of [<code>ControlledPromise</code>](#ControlledPromise)  
<a name="ControlledPromise+timeout"></a>

### controlledPromise.timeout(ms, [reason])
Sets timeout to reject promise automatically.

**Kind**: instance method of [<code>ControlledPromise</code>](#ControlledPromise)  

| Param | Type | Description |
| --- | --- | --- |
| ms | <code>Number</code> | delay in ms after that promise will be rejected automatically |
| [reason] | <code>String</code> \| <code>Error</code> \| <code>function</code> | rejection value. If it is string or error - promise will be rejected with that error. If it is function - this function will be called after delay where you can manually resolve or reject promise via `.resolve() / .reject()` methods. |


## License
MIT @ [Vitaliy Potapov](https://github.com/vitalets)

[Promise]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Promises]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
