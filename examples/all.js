/**
 * Demostrate a test to verify given an input message, we get an output message.
 */

/*
 * Initialize the bus
 */

var bus = require('bus.io')();
bus.in('shout', function (message, socket, next) {
  console.log('in shout', message.id(), socket.id, next);
  assert.equal(typeof next,'function','next() is a function');
  message.content(message.content().toUpperCase()).target('everyone').deliver();
});
bus.on('shout', function (message, next) {
  console.log('on shout', message.id(), next);
  assert.equal(typeof next,'function','next() is a function');
  message.content(message.content()+'!!').deliver();
});
bus.out('shout', function (message, socket, next) {
  console.log('out shout', message, socket, next);
  assert.equal(typeof next,'function','next() is a function');
  message.content(message.content()+'!').deliver();
});

/*
 * Perform the test
 */

var assert = require('assert');
var Message = require('bus.io-common').Message;
var message = Message().action('shout').content('hi');
var driver = require('./..');
driver(bus).in(message).on(message).out(message).done(function (err, message) {
  if (err) throw err;
  assert.equal(message.target(), 'everyone');
  assert.equal(message.content(), 'HI!!!');
  process.exit();
});

