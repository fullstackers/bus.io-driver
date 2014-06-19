var events = require('events');

module.exports = Driver;

/**
 * Test drives the bus!
 *
 * @param {Bus} bus
 * @param {EventEmitter} socket *optional
 * @return Bus
 */

function Driver (bus, socket) {
  if (!(this instanceof Driver)) return new Driver(bus);
  var self = this;
  this.bus = bus;
  this.socket = typeof socket === 'object' && socket instanceof events.EventEmitter ? socket : new events.EventEmitter();
  this.socket.id = this.socket.id = 1;
}

/**
 * Produces a function that will pump the message through a receiver
 *
 * @api private
 * @param {Receiver} receiver
 * @param {Message} message
 */

Driver.prototype._step = function (source, message, socket) {

  return function (msg, cb) {

    msg = msg || message;
    console.log('msg', msg);

    console.log('source._events', source._events);

    var events = source._events;

    console.log('source._events', source._events);

    source._events = {};

    console.log('source._events', source._events);

    source.removeAllListeners();

    console.log('source._events', source._events);

    source.once('received', function (a) {
      console.log('received source._events', source._events);
      source._events = events;
      console.log('received source._events', source._events);
      console.log('equals?', msg === a);
      console.log( String(cb));
      cb(null, a);
    });

    source.once('error', function (err) {
      console.log('error source._events', source._events);
      source._events = events;
      console.log('error source._events', source._events);
      cb(err); 
    });

    source.onReceive(msg, socket);

  };
};

/**
 * The event handlers to test when processing a message going from the socket to the bus.
 *
 * @param {Message} message
 * @return Driver
 */

Driver.prototype.in = function (message) {
  this._steps = this._steps || [];
  this._steps.push(this._step(this.bus.incomming(), message, this.socket));
  return this;
};

/**
 * The event handlers to test when procesing a message on the bus.
 *
 * @param {Message} message
 * @return Driver
 */

Driver.prototype.on = function (message) {
  this._steps = this._steps || [];
  this._steps.push(this._step(this.bus.processing(), message));
  return this;
};

/**
 * The event handlers to test going from the bus to the socket.
 *
 * @param {Message} message
 * @return Driver
 */

Driver.prototype.out = function (message) {
  this._steps = this._steps || [];
  this._steps.push(this._step(this.bus.outgoing(), message, this.socket));
  return this;
};

/**
 * performs the test and invokes the passed callback
 *
 * @param {Function} cb
 */

Driver.prototype.done = function (cb) {
  var steps = this._steps || [], i = 0;

  (function next (msg) {
    console.log(steps[i], 'step', i, 'msg', msg ? msg.id() : null, 'cnt', msg ? msg.content() : null);
    steps[i](msg, function (err, message) {
      console.log('err', err, 'message', message.id(), 'content', message.content());
      if (err) return cb(err);
      if (++i >= steps.length) return cb(null, message);
      next(message); 
    });
  })(null);
};

