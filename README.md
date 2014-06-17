[![Build Status](https://travis-ci.org/turbonetix/bus.io-driver.svg?branch=master)](https://travis-ci.org/turbonetix/bus.io-driver)
[![NPM version](https://badge.fury.io/js/bus.io-driver.svg)](http://badge.fury.io/js/bus.io-driver)
[![David DM](https://david-dm.org/turbonetix/bus.io-driver.png)](https://david-dm.org/turbonetix/bus.io-driver.png)

![Bus.IO](https://raw.github.com/turbonetix/bus.io/master/logo.png)

Test driver your bus.io apps with driver.

```javascript

var driver = require('bus.io-driver');
var bus = require('./bus.js');
driver(bus)
  .on(Message().content('hi'))
  .done(function (err, message) {
    if (err) throw err;
    assert.equal(message.content(), 'HI');
  });

```

# Examples

Say you want to test this bus.io app.

```javascript

var bus = require('bus.io')();

bus.in('shout', function (message, socket) {
  message.target('everyone').deliver();
});

bus.on('shout', function (message) {
  message.content(message.content().toUpperCase()).deliver();
});

bus.out('shout', function (message) {
  message.content(message.content() + '!!!').deliver();
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
  .on(Message().action('shout').content('hi')
  .done(function (err, mesage) { 
    if (err) throw err;
    assert.equal(message.target(), 'everyone');
  });

// test the "shout" message handler when processing on the bus

driver(bus)
  .on(Message().action('shout').content('hi))
  .done(function (err, message0 {
    if (err) throw err;
    assert.equal(message.content(), 'HI');
  });


// test the "shout" message handler when going from the bus to the socket

driver(bus)
  .on(Message().action('shout').content('HI'))
  .done(function (err, message) {
    if (err) throw err;
    assert.equal(message.content(), 'HI!!!');
  });


```

Test the whole trip.

```javascript

var message = Message().action('shout').content('hi');

driver(bus)
  .in(message).on(message).out(message)
  .done(function (err, message) {
    if (err) throw err;
    assert.equal(message.target(), 'everyone');
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

### Driver#(bus:Bus, socket:EventEmitter)

```javascript

var events = require('events');
var socket = new events.EventEmitter;
var driver = require('bus.io-driver');
var bus = require('./bus.js');
var instance = driver(bus, socket);

```

### Driver#in(message:Message)

Pipes the message through the `in()` receiver stack of middleware.

```javascript

driver(bus).in(Message().action('shout'));

```

### Driver#on(message:Message)

Pipes the message through the `on()` receiver stack of middleware.

```javascript

driver(bus).on(Message().action('shout'));

```

### Driver#out(message:Message)

Pipes the message through the `out()` receiver stack of middleware.

```javascript

driver(bus).out(Message().action('shout'));

```

### Driver#done(cb:Function)

```javascript

driver.done(function (err, message) {
  if (err) throw nerr;
  assert.equal(message.content(), 'HI!!!');
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

## TODO
