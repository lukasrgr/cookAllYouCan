
An enhanced EventEmitter with extra methods for detecting whether an event has any handlers or not for efficient event handler attachment.

Install
=======

```
npm install emitter-b
```

or download the built package `EmitterB.umd.js` from the 'dist' folder in the repository

Usage
=====

```javascript
var EmitterB = require('emitter-b')  // node.js and webpack

define(['EmitterB.umd.js'], function(EmitterB) { ... } // amd

<script src="EmitterB.umd.js">&lt;/script>
<script>
  EmitterB; // global 'EmitterB' module object
</script>

```

All methods and properties from [`EventEmitter`](http://nodejs.org/api/events.html) are inherited. *Most of these are inherited from [`EventEmitter`](http://nodejs.org/api/events.html).* The important ones:

**`emitter.emit(event, data, data2, ...)`** - Emits an event that triggers handlers setup via the Gem's `on` methods.

**`emitter.on(event, callback)`** - Registers a `callback` that will be called when the passed `event` is `emit`ted.  
* `event` - The string event name to listen for.
* `callback(data, data2, ...)` - the callback gets any arguments passed to `emit` after the event name.

**`emitter.once(event, callback)`** - Like `on` but the `callback` will only be called the first time the event happens.

**`emitter.off(event, callback)`** - Removes a callback as an event handler (the `callback` won't be called for that event again).
**`emitter.removeListener(event,callback)`** - *Same as `off`.*

**`emitter.removeAllListeners(event)`** - Removes all the callbacks for the passed `event`.
**`emitter.removeAllListeners()`** - Removes all callbacks.

##### `ifon`

The `ifon` and related methods are useful primarily for performance reasons. They allow registering event listeners only when they're needed, so that the browser doesn't get overloaded with event handlers. Its recommended that `ifon` is used whenever possible.

An example:

```javascript
var child = EmitterB()
var parent = EmitterB()

var handler;
parent.ifon('someoneClickedTheThing', function() {
    child.on('click', handler = function() {
        parent.emit('someoneClickedTheThing', "I can't believe it")
    })
})
parent.ifoff('someoneClickedTheThing', function() {
    child.off('click', handler)
})
```

**`emitter.ifon(event, callback)`** - Registers a callback that will be called when a handler is registered for `event` if it had no handler registered previously. If there is already a listener attached to that event, `callback` is called immediately.  
**`emitter.ifon(callback)`** - Registers a callback that will be called when the first handler for any event is registered.
* `callback(event)` - The callback gets the newly registered event type as its argument.

**`emitter.ifoff(event, callback)`** - Registers a callback that will be called when the last handler for `event` is unregistered.  
**`emitter.ifoff(callback)`** - Registers a callback that will be called when the last handler for any event is unregistered.
* `callback(event)` - The callback gets the unregistered event type as its argument.

**`emitter.removeIfon()`** - Removes all `ifon` handlers.  
**`emitter.removeIfon(event)`** - Removes all `ifon` handlers for the passed `event`.  
**`emitter.removeIfon(callback)`** - Removes `callback` as an "all" `ifon` handler (a callback passed to `ifon` without an event).  
**`emitter.removeIfon(event, callback)`** - Removes `callback` as an `ifon` handler for the passed `event`.

**`emitter.removeIfoff()`** - Removes all `ifoff` handlers.  
**`emitter.removeIfoff(event)`** - Removes all `ifoff` handlers for the passed `event`.  
**`emitter.removeIfoff(callback)`** - Removes `callback` as an "all" `ifoff` handler (a callback passed to `ifoff` without an event).  
**`emitter.removeIfoff(event, callback)`** - Removes `callback` as an `ifoff` handler for the passed `event`.

##### `proxy`

*The `proxy` method uses `ifon` and `ifoff` to minmize the number of event listeners that need to be attached in the system.*

**`emitter.proxy(emitter, options)`** - Proxies event registration to `emitter`.  
* `emitter` - The emitter (usually a `Gem`) to proxy handler binding to  
* `options` - An object that defines what events are proxied. If `undefined`, all events are proxied. The object can have one of the following properties:
  * `only` - An array of events to proxy.
  * `except` - An array of events to *not* proxy. All other events are proxied.

Example of `proxy`:

```javascript
var A = Text()
var B = Text()

A.proxy(B)
A.on("click", function(arg) {
    console.log("hey hey heyyy! "+arg)
})

B.emit("click", "Ughh..") // console prints "hey hey heyyy! Ughh.."
```

Todo
======

Changelog
========

* 1.0.0 - Initial commit - code transferred from Gem.js.

How to Contribute!
============

Want to contribute? Start with the [Contributing Guide](CONTRIBUTING.md)!

Anything helps:

* Creating issues (aka tickets/bugs/etc). Please feel free to use issues to report bugs, request features, and discuss changes.
* Updating the documentation: ie this readme file. Be bold! Help create great documentation!
* Submitting pull requests.

License
=======
Released under the MIT license: http://opensource.org/licenses/MIT
