# Pendings

[![Build Status](https://travis-ci.org/vitalets/pendings.svg?branch=master)](https://travis-ci.org/vitalets/pendings)
[![npm](https://img.shields.io/npm/v/pendings.svg)](https://www.npmjs.com/package/pendings)
[![license](https://img.shields.io/npm/l/pendings.svg)](https://www.npmjs.com/package/pendings)

> Better control of JavaScript [Promises]

This is a wrapping library over [Promises] giving you more control of promise lifecycle. 
It is especially useful for promises in event-based code where you need to store `resolve` / `reject`
callbacks and call them later.
*ControlledPromise* allows to reduce boilerplate code and split business logic from promise manipulation.

## Installation
```bash
npm install pendings --save
```

## Features
* provides convenient access to `resolve` / `reject` callbacks
* automatically returns existing promise while it is in pending state
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
The same class with [ControlledPromise](#ControlledPromise) is 3 lines of code:   
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

[Promises]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
