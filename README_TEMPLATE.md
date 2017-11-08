# controlled-promise
[![Build Status](https://travis-ci.org/vitalets/controlled-promise.svg?branch=master)](https://travis-ci.org/vitalets/controlled-promise)
[![npm](https://img.shields.io/npm/v/controlled-promise.svg)](https://www.npmjs.com/package/controlled-promise)
[![license](https://img.shields.io/npm/l/controlled-promise.svg)](https://www.npmjs.com/package/controlled-promise)
<img align="right" src="https://user-images.githubusercontent.com/1473072/31122235-ad06e442-a843-11e7-8c7e-c24149b6eeda.png"/>

> Better control of JavaScript [Promises]

A [Promise] wrapping library for advanced control of promise lifecycle. 
Allows to split business logic from promise manipulation:
 
* promisify event-emitters: easy access to `resolve` / `reject` callbacks
* return existing promise while it is pending
* auto-reject after configured timeout
* tiny size and zero dependencies

## Installation
```bash
npm install controlled-promise --save
```

## Usage
Example of wrapping event-emitter in promise:
```js
const ControlledPromise = require('controlled-promise');
const waiting = new ControlledPromise();

function waitSomeEvent() {
  return waiting.call(() => {
    const emitter = new EventEmitter();    
    emitter.on('event', event => waiting.resolve(event));
    emitter.on('error', error => waiting.reject(error));
    emitter.runAsyncAction();
  });
}

waitSomeEvent()
  .then(...);
```

The same with native promises:
```js
let promise;
let resolve;
let reject;

function waitSomeEvent() {
  if (promise) { // If promise already pending - return it
    return promise;
  }
  promise = new Promise((_resolve, _reject) => {
    resolve = _resolve; // Store callbacks for future fulfillemnt
    reject = _reject;
    const emitter = new EventEmitter();    
    emitter.on('event', event => onEvent(event));
    emitter.on('error', error => onError(error));
    emitter.runAsyncAction();
  });
  return promise;
}

function onEvent(event) {
  resolve(event);
  promise = null;
}

function onError(error) {
  reject(error);
  promise = null;
}

waitSomeEvent()
  .then(...);
```

## API

{{>main}}

## Related
* [event-to-promise](https://github.com/JsCommunity/event-to-promise)
* [promise-events](https://github.com/yanickrochon/promise-events)

## License
MIT @ [Vitaliy Potapov](https://github.com/vitalets)

[Promise]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Promises]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
