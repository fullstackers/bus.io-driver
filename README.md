[![Build Status](https://travis-ci.org/turbonetix/bus.io-driver.svg?branch=master)](https://travis-ci.org/turbonetix/bus.io-driver)
[![NPM version](https://badge.fury.io/js/bus.io-driver.svg)](http://badge.fury.io/js/bus.io-driver)
[![David DM](https://david-dm.org/turbonetix/bus.io-driver.png)](https://david-dm.org/turbonetix/bus.io-driver.png)

![Bus.IO](https://raw.github.com/turbonetix/bus.io/master/logo.png)

Test driver your bus.io apps with `bus.io-driver`.

```javascript
var Message = require('bus.io-common').Message;
var driver = require('bus.io-driver');
var bus = require('bus.io')();
bus.on(function (msg, next) {
  msg.content(msg.content().toUpperCase());
});
driver(bus)
  .on(Message().content('hi'))
  .done(function (err, msg) {
    if (err) throw err;
    assert.equal(msg.content(), 'HI');
  });
```

# Examples

Say you want to test this bus.io app.

```javascript
var bus = require('bus.io')();

bus.in('shout', function (msg, sock) {
  msg.target('everyone').deliver();
});

bus.on('shout', function (msg) {
  msg.content(msg.content().toUpperCase()).deliver();
});

bus.out('shout', function (msg) {
  msg.content(msg.content() + '!!!').deliver();
});
```

You would do it like this with *driver*.

```javascript
var driver = require('bus.io-driver');
var assert = require('assert');
var Message = require('bus.io-common').Message;
var bus = require('./my-bus.io-app.js');

// test the "shout" message handler when going from the socekt to the bus

driver(bus)
  .on(Message().action('shout').content('hi'))
  .done(function (err, mesage) { 
    if (err) throw err;
    assert.equal(msg.target(), 'everyone');
  });

// test the "shout" message handler when processing on the bus

driver(bus)
  .on(Message().action('shout').content('hi'))
  .done(function (err, ms) {
    if (err) throw err;
    assert.equal(msg.content(), 'HI');
  });

// test the "shout" message handler when going from the bus to the socket

driver(bus)
  .on(Message().action('shout').content('HI'))
  .done(function (err, msg) {
    if (err) throw err;
    assert.equal(msg.content(), 'HI!!!');
  });
```

Test the whole trip.

```javascript
var msg = Message().action('shout').content('hi');

driver(bus)
  .in(msg).on(msg).out(msg)
  .done(function (err, msg) {
    if (err) throw err;
    assert.equal(msg.target(), 'everyone');
    assert.equal(message.content(), 'HI!!!');
  });
```

# Installation and Environment Setup

Install node.js (See download and install instructions here: http://nodejs.org/).

Clone this repository

    > git clone git@github.com:turbonetix/bus.io-driver.git

cd into the directory and install the dependencies

    > cd bus.io-driver
    > npm install && npm shrinkwrap --dev

# API

## Driver

### Driver#(bus:Bus)

```javascript

var driver = require('bus.io-driver');
var bus = require('./bus.js');

var instance = driver(bus);

```

### Driver#(bus:Bus, sock:EventEmitter)

```javascript
var events = require('events');
var sock = new events.EventEmitter;
var driver = require('bus.io-driver');
var bus = require('./bus.js');
var instance = driver(bus, sock);
```

### Driver#in(msg:Message)

Pipes the message through the `in()` receiver stack of middleware.

```javascript
driver(bus).in(Message().action('shout'));
```

### Driver#on(msg:Message)

Pipes the message through the `on()` receiver stack of middleware.

```javascript
driver(bus).on(Message().action('shout'));
```

### Driver#out(msg:Message)

Pipes the message through the `out()` receiver stack of middleware.

```javascript
driver(bus).out(Message().action('shout'));
```

### Driver#done(cb:Function)

```javascript
driver.done(function (err, msg) {
  if (err) throw nerr;
  assert.equal(msg.content(), 'HI!!!');
});
```

# Running Tests

Install coffee-script

    > npm install coffee-script -g

Tests are run using grunt.  You must first globally install the grunt-cli with npm.

    > sudo npm install -g grunt-cli

## Unit Tests

To run the tests, just run grunt

    > grunt spec

# Examples

Examples are under the `examples/` directory.

# TODO
