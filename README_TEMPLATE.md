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

{{>main}}

## License
MIT @ [Vitaliy Potapov](https://github.com/vitalets)

[Promise]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Promises]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
