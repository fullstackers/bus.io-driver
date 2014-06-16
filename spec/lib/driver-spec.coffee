describe 'Driver', ->

  Given -> @socket = new require('events').EventEmitter
  Given -> @message = require('bus.io-common').Message()
  Given -> @message.content 'hi'
  Given -> @event = 'shout'
  Given -> @bus = require('bus.io')()
  Given -> @bus.in @event, (message, socket) -> message.target('everyone').deliver()
  Given -> @bus.on @event, (message) -> message.content(message.content().toUpperCase()).deliver()
  Given -> @bus.out @event, (message, socket) -> message.content(message.content() + '!!!').deliver()
  Given -> @Driver = requireSubject 'lib/driver', {}

  describe '#', ->

    When -> @res = @Driver @bus
    Then -> expect(@res instanceof @Driver).toBe true

  describe 'prototype', ->

    Given -> @driver = @Driver @bus

    describe '#in (event:String)', ->

      Given -> @res = @driver.in @event
      Then - expect(@res).toEqual @driver

    describe '#on (event:String)', ->

      Given -> @res = @driver.on @event
      Then - expect(@res).toEqual @driver

    describe '#out (event:String)', ->

      Given -> @res = @driver.out @event
      Then - expect(@res).toEqual @driver

    describe '#with (message:Message)', ->

      Given -> @res = @driver.with @message
      Then - expect(@res).toEqual @driver

    describe '#with', ->

      Given -> @driver.with @message
      When ->  @res = @driver.with()
      Then -> expect(@res).toEqual @message

    describe '#done (cb:Function)', ->

      Given -> @driver.in @event
      Given -> @driver.on @event
      Given -> @driver.out @event
      Given -> @driver.with @message
      Given (done) -> @driver.done (err, message) -> done()
      Then -> expect(@message.target()).toBe 'everyone'
      And -> expect(@message.content()).toBe 'HI!!!'
