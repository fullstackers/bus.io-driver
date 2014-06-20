/**
 * Demostrate a test to verify given an input message, we get an output message.
 */

/*
 * Initialize the bus
 */

var bus = require('bus.io')();
bus.in('shout', function (msg, sock, next) {
  assert.equal(typeof next,'function','next() is a function');
  msg.content(msg.content().toUpperCase()).target('everyone').deliver();
});
bus.on('shout', function (msg, next) {
  assert.equal(typeof next,'function','next() is a function');
  msg.content(msg.content()+'!!').deliver();
});
bus.out('shout', function (msg, sock, next) {
  assert.equal(typeof next,'function','next() is a function');
  msg.content(msg.content()+'!').deliver();
});

/*
 * Perform the test
 */

var assert = require('assert');
var Message = require('bus.io-common').Message;
var msg = Message().action('shout').content('hi');
var driver = require('./..');
driver(bus).in(msg).on(msg).out(msg).done(function (err, msg) {
  if (err) throw err;
  assert.equal(msg.target(), 'everyone');
  assert.equal(msg.content(), 'HI!!!');
  process.exit();
});

