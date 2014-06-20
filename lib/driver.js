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

Driver.prototype._step = function (receiver, message, socket) {

  return function step (msg, cb) {

    // use "message" if it exists since it was used to create this step, if it doesn't
    // exist use "msg" which we received from a callback.
    msg = message || msg;

    // if we reecyled a message from a previous reciever, clear the flags.
    msg.received = msg.consumed = msg.delivered = undefined;

    var events = receiver._events;
    receiver._events = {};

    receiver.once('received', function (msg) {
      receiver._events = events;
      cb(null, msg);
    });

    receiver.once('error', function (err) {
      receiver._events = events;
      cb(err); 
    });

    if (socket) {
      receiver.onReceive(msg, socket);
    }
    else {
      receiver.onReceive(msg);
    }
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
    steps[i](msg, function (err, message) {
      if (err) return cb(err);
      if (++i >= steps.length) return cb(null, message);
      next(message); 
    });
  })(null);
};

