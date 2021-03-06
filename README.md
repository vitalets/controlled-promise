
---

**This repo is DEPRECATED in favor of [promise-controller](https://github.com/vitalets/promise-controller)!**

---

# controlled-promise
[![Build Status](https://travis-ci.org/vitalets/controlled-promise.svg?branch=master)](https://travis-ci.org/vitalets/controlled-promise)
[![npm](https://img.shields.io/npm/v/controlled-promise.svg)](https://www.npmjs.com/package/controlled-promise)
[![license](https://img.shields.io/npm/l/controlled-promise.svg)](https://www.npmjs.com/package/controlled-promise)
<img align="right" src="https://user-images.githubusercontent.com/1473072/31122235-ad06e442-a843-11e7-8c7e-c24149b6eeda.png"/>

A [Promise] wrapping library for advanced control of promise lifecycle. 
Allows to split business logic from promise manipulation:
 
* automatically store `resolve` / `reject` functions for future call
* return existing promise while async operation is still pending
* auto-reject after configured timeout

## Installation
```bash
npm install controlled-promise --save
```

## Usage
```js
const ControlledPromise = require('controlled-promise');

// Create controlled promise
const controlledPromise = new ControlledPromise();

// Calls asynchronous function and returns promise. 
// The `resolve / reject` functions can be called later as `controlledPromise.resolve() / controlledPromise.reject()`.
const promise = controlledPromise.call(() => someAsyncFn());

// Resolve promise later via cp.resolve()
controlledPromise.resolve();

// OR reject promise later via cp.reject()
controlledPromise.reject(error);
```
## API

<a name="ControlledPromise"></a>

### ControlledPromise
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

#### new ControlledPromise()
Creates controlled promise. In contrast to original Promise, it does not immediately call any function.
Instead it has [.call()](#ControlledPromise+call) method for that and `resolve / reject` methods for
resolving promise.

<a name="ControlledPromise+promise"></a>

#### controlledPromise.promise ⇒ <code>Promise</code>
Returns promise itself.

**Kind**: instance property of [<code>ControlledPromise</code>](#ControlledPromise)  
<a name="ControlledPromise+value"></a>

#### controlledPromise.value ⇒ <code>\*</code>
Returns value with that promise was fulfilled (resolved or rejected).

**Kind**: instance property of [<code>ControlledPromise</code>](#ControlledPromise)  
<a name="ControlledPromise+isPending"></a>

#### controlledPromise.isPending ⇒ <code>Boolean</code>
Returns true if promise is pending.

**Kind**: instance property of [<code>ControlledPromise</code>](#ControlledPromise)  
<a name="ControlledPromise+isFulfilled"></a>

#### controlledPromise.isFulfilled ⇒ <code>Boolean</code>
Returns true if promise is fulfilled.

**Kind**: instance property of [<code>ControlledPromise</code>](#ControlledPromise)  
<a name="ControlledPromise+isRejected"></a>

#### controlledPromise.isRejected ⇒ <code>Boolean</code>
Returns true if promise rejected.

**Kind**: instance property of [<code>ControlledPromise</code>](#ControlledPromise)  
<a name="ControlledPromise+isSettled"></a>

#### controlledPromise.isSettled ⇒ <code>Boolean</code>
Returns true if promise fulfilled or rejected.

**Kind**: instance property of [<code>ControlledPromise</code>](#ControlledPromise)  
<a name="ControlledPromise+isCalled"></a>

#### controlledPromise.isCalled ⇒ <code>Boolean</code>
Returns true if promise already called via `.call()` method.

**Kind**: instance property of [<code>ControlledPromise</code>](#ControlledPromise)  
<a name="ControlledPromise+call"></a>

#### controlledPromise.call(fn) ⇒ <code>Promise</code>
This method executes `fn` and returns promise. While promise is pending all subsequent calls of `.call(fn)`
will return the same promise. To fulfill that promise you can use `.resolve() / .reject()` methods.

**Kind**: instance method of [<code>ControlledPromise</code>](#ControlledPromise)  

| Param | Type |
| --- | --- |
| fn | <code>function</code> | 

<a name="ControlledPromise+resolve"></a>

#### controlledPromise.resolve([value])
Resolves pending promise with specified `value`.

**Kind**: instance method of [<code>ControlledPromise</code>](#ControlledPromise)  

| Param | Type |
| --- | --- |
| [value] | <code>\*</code> | 

<a name="ControlledPromise+reject"></a>

#### controlledPromise.reject([value])
Rejects pending promise with specified `value`.

**Kind**: instance method of [<code>ControlledPromise</code>](#ControlledPromise)  

| Param | Type |
| --- | --- |
| [value] | <code>\*</code> | 

<a name="ControlledPromise+reset"></a>

#### controlledPromise.reset()
Resets to initial state.

**Kind**: instance method of [<code>ControlledPromise</code>](#ControlledPromise)  
<a name="ControlledPromise+timeout"></a>

#### controlledPromise.timeout(ms, [reason])
Sets timeout to reject promise automatically.

**Kind**: instance method of [<code>ControlledPromise</code>](#ControlledPromise)  

| Param | Type | Description |
| --- | --- | --- |
| ms | <code>Number</code> | delay in ms after that promise will be rejected automatically |
| [reason] | <code>String</code> \| <code>Error</code> \| <code>function</code> | rejection value. If it is string or error - promise will be rejected with that error. If it is function - this function will be called after delay where you can manually resolve or reject promise via `.resolve() / .reject()` methods. |

## Related
* [event-to-promise](https://github.com/JsCommunity/event-to-promise)
* [promise-events](https://github.com/yanickrochon/promise-events)

## License
MIT @ [Vitaliy Potapov](https://github.com/vitalets)

[Promise]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Promises]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
