
module.exports = Driver;

/**
 * Test drives the bus!
 *
 * @param {Bus} bus
 * @return Bus
 */

function Driver (bus) {
  if (!(this instanceof Driver)) return new Driver(bus);
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
  return this;
};

/**
 * performs the test and invokes the passed callback
 *
 * @param {Function} cb
 */

Driver.prototype.done = function (cb) {
  cb(new Error('Needs Implemented!'), null);
};

