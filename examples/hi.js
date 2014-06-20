var Message = require('bus.io-common').Message;
var driver = require('./..');
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
