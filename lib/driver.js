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

  return function step (msg, cb) {

    console.log('step [' + step.description + ']');

    msg = message || msg;
    msg.received = msg.consumed = msg.delivered = undefined;

    var events = source._events;
    source._events = {};

    source.on('received', function (msg) {
      source._events = events;
      console.log(step.description + ' received ' + msg.id());
      cb(null, msg);
    });

    source.on('error', function (err) {
      console.log(step.description + ' received ' + a.id());
      source._events = events;
      cb(err); 
    });

    if (socket) {
      source.onReceive(msg, socket);
    }
    else {
      source.onReceive(msg);
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
  var step = this._step(this.bus.incomming(), message, this.socket);
  step.description = 'in';
  this._steps.push(step);
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
  var step = this._step(this.bus.processing(), message);
  step.description = 'on';
  this._steps.push(step);
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
  var step = this._step(this.bus.outgoing(), message, this.socket);
  step.description = 'out';
  this._steps.push();
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

