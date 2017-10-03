<img align="right" src="https://user-images.githubusercontent.com/1473072/31122235-ad06e442-a843-11e7-8c7e-c24149b6eeda.png"></img>

# controlled-promise

[![Build Status](https://travis-ci.org/vitalets/controlled-promise.svg?branch=master)](https://travis-ci.org/vitalets/controlled-promise)
[![npm](https://img.shields.io/npm/v/controlled-promise.svg)](https://www.npmjs.com/package/controlled-promise)
[![license](https://img.shields.io/npm/l/controlled-promise.svg)](https://www.npmjs.com/package/controlled-promise)

> Better control of JavaScript [Promises]

A [Promise] wrapping library with advanced control of promise lifecycle. Allows to split out business logic
from promise manipulation:
 
* convenient access to `resolve` / `reject` callbacks
* return existing promise while it is pending
* auto-reject after configured `timeout`
* tiny size and zero dependencies

## Installation
```bash
npm install controlled-promise --save
```

## Usage
Example of class sending some data asynchronously and waiting for the response event.  
With controlled promise:
```js
const ControlledPromise = require('controlled-promise');

class Foo {
    constructor() {
        this.sending = new ControlledPromise();
    }
    asyncRequest() {
        // Send request and return promise. While promise is pending - it will be returned on all subsequent calls.
        return this.sending.call(() => this.send({foo: 'bar'}));
    }
    onResponse(response) {
        // Resolve promise when async response comes.
        if (response) {
          this.sending.resolve(response);
        } else {
          this.sending.reject(new Error('Empty response'));
        }
    }
}
```
The same class with native promise:
```js
class Foo {
    constructor() {
        this.promise = null;
        this.resolve = null;
        this.reject = null;
    }
    asyncRequest() {
        if (this.promise) {
            return this.promise;
        }
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            this.send({foo: 'bar'});
        });
        return this.promise;
    }
    onResponse(response) {
        if (response) {
          this.resolve(response);
        } else {
          this.reject(new Error('Empty response'));
        }
        this.promise = null;
    }
}    
```

## API

{{>main}}

## License
MIT @ [Vitaliy Potapov](https://github.com/vitalets)

[Promise]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Promises]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
