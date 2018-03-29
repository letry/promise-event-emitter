# promise-event-emitter

EventEmitter like class which uses a promise instead of a callback.

## Installation

[npm package](https://npmjs.org/package/promise-event-emitter)

```
> npm install --save promise-event-emitter
```

```javascript
const PromiseEventEmitter = require('promise-event-emitter');
```

## Quickstart

```javascript
const PromiseEventEmitter = require('promise-event-emitter');
const emitter = new PromiseEventEmitter();

const eventPromise = emitter.on('connect', 'error')
    .then(([userId, connection]) => {
        console.log(userId, connection) // 'Ivan', {}
    })
    .catch(([reason]) => {
        console.error(reason) // connection refused
    });


emitter.emit('connect', 'Ivan', {}); // in this case eventPromise become fullfilled
emitter.emit('error', 'connection refused'); // in this case eventPromise become rejected
emitter.off('connect'); // in this case by default eventPromise will never be fulfilled or rejected
```

## API
This package requires ES6 Promise and Map.

### emitter.on(successEvent: String || [String], rejectEvent: String || [String]) => Promise
 Returns a promise that is waiting for emit first event of the arguments.
 successEvent and rejectEvent can be a string or a string array. 
 Promise handler will get an array of arguments passed to emit function.
 This method is syntax sugar for 'once' method.
```js
const eventPromise = emitter.on('connect', ['error', 'fail']); 
/* eventPromise become:
    fullfilled when emit 'connect' event 
    rejected when emit 'error' or 'fail'
*/
```

### emitter.emit(event: String, ...args) => Boolean
 Emits a event and fulfills promises of subscribers with array of passed arguments.
 Then it removes the specified event from the event-promise map.
 Returns true if the event had listeners, false otherwise.
 ```
 emitter.once('message').then(console.log); // ['Ivan', 'hello world!']
 emitter.emit('message', 'Ivan', 'hello world!');
 ```
 
### emitter.off(event: String, type: String = 'pass', reason: Any = 'Handler removed') => Boolean
 Removes the specified event from the event-promise map.
 Arguments 'type' and 'reason' is optional.
 Argument 'type' set behavior to promises of subscribers. 
 It can be one of the following strings:
 * pass(by default) - do nothing
 * resolve
 * reject
 
 Argument reason will be passed as argument to handler.
 Returns true if the event had listeners, false otherwise.
```
emitter.on('message').catch(console.error) // ['the connection is lost']
emitter.off('message', 'reject', 'the connection is lost');
```
### emitter.once(event: String) => Promise
 Find by event registered promise in event-promise map or create it.
 Returns a promise that will be fulfill when the event will be emitted.
  ```
 const promise1 = emitter.once('connect');
 const promise2 = emitter.once('connect');
 console.log(promise1 === promise2) // true
 
 promise1.then(console.log); // ['Jack']
 promise2.then(console.log); // ['Jack']
 emitter.emit('connect', 'Jack');
 ```
 
### emitter.all(events: [String]) => Promise
 Returns a promise that will be fulfill when all event will be emitted.
```
emitter.all(['connect', 'message'])
    .then(console.log); // [['Ivan'], ['Hello world!']]
emitter.emit('connect', 'Ivan');
emitter.emit('message', 'Hello world!');
```
### emitter.eventNames() => [String]
 Returns an array of event names that are registered in the event-promise map.
```
emitter.on('connect', ['error', 'fail']);
console.log(emitter.eventNames()) // ['connect', 'error', 'fail'];
```

### emitter.eventPromiseMap
Each instance of the promise-event-emitter class stores an event-promise Map.
This allows any type of data to be used as event.
```
const event = new Event('myEvent');
emitter.once(event).then(console.log); // [42];
emitter.emit(event, 42);
```

## License

ISC © [Letry](https://github.com/letry)
