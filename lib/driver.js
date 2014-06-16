
module.exports = Driver;

/**
 * Test drives the bus!
 *
 * @param {Bus} bus
 * @return Bus
 */

function Driver (bus) {
  if (!(this instanceof Driver)) return new Driver(bus);
  var self = this;
  this.bus = bus;
}

/**
 * The event handlers to test when processing a message going from the socket to the bus.
 *
 * @param {String} event
 * @return Driver
 */

Driver.prototype.in = function (event) {
  return this;
};

/**
 * The event handlers to test when procesing a message on the bus.
 *
 * @param {String} event
 * @return Driver
 */

Driver.prototype.on = function (event) {
  return this;
};

/**
 * The event handlers to test going from the bus to the socket.
 *
 * @param {String} event
 * @return Driver
 */

Driver.prototype.out = function (event) {
  return this;
};

/**
 * The message to test with
 *
 * @param {Messge} Message
 * @return Driver
 */

Driver.prototype.with = function (message) {
  if (message) {
    this.message = message;
    return this;
  }
  return this.message;
};

/**
 * performs the test and invokes the passed callback
 *
 * @param {Function} cb
 */

Driver.prototype.done = function (cb) {
  cb(new Error('Needs Implemented!'), null);
};

/**
 * pipes the message through the specified receiver and invokes the callback
 *
 * @api private
 * @param {Receiver} receiver
 * @param {Function} listener
 * @param {String} next
 * @param {Message} message
 * @param {Socket} socket
 */

Driver.prototype.step = function (receiver, listener, next, message, socket, done) {
  var self = this;
  receiver.removeListener('received', listener);
  receiver.once('received', function (message, socket) {
    receiver.addListener('received', listener);
    self.bus.emit(next, message);
    if ('function' === typeof done) done();
  });
  receiver.onReceive(message, socket);
};

/**
 * Builds a function that calls "step" with the parameters
 *
 * @api private
 */

Driver.prototype.pushStep = function (receiver, listener, next, message, socket, done) {

  return function () {
    this.step(receiver, listener, next, message, socket, done);
  };

};
