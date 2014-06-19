events = require 'events'

describe 'Driver', ->

  Given -> @socket = new events.EventEmitter
  Given -> @event = 'shout'
  Given -> @message = require('bus.io-common').Message()
  Given -> @message.action @event
  Given -> @message.content 'hi'
  Given -> @bus = require('bus.io')()
  Given ->
    @bus.in @event, (message, socket) -> 
      message.target('everyone').deliver()
  Given ->
    @bus.on @event, (message) ->
      message.content(message.content().toUpperCase()).deliver()
  Given ->
    @bus.out @event, (message, socket) ->
      message.content(message.content() + '!!!').deliver()
  Given -> @Driver = requireSubject 'lib/driver', {}

  describe '# (bus:Bus)', ->

    When -> @res = @Driver @bus
    Then -> expect(@res instanceof @Driver).toBe true

  describe '# (bus:Bus, socket:EventEmitter)', ->

    When -> @res = @Driver @bus, @socket
    Then -> expect(@res instanceof @Driver).toBe true
    And -> expect(@res.socket).toEqual @socket

  describe 'prototype', ->

    Given -> @driver = @Driver @bus

    describe.only '#_step (source:Receiver, message:Message)', ->

      Given -> @receiver = @bus.incomming()
      Given -> spyOn(events.EventEmitter.prototype.emit,['apply']).andCallThrough()
      Given -> @events = @receiver._events
      Given -> @step = @driver._step @receiver, @message
      When (done) -> @step @message, done
      Then -> expect(@receiver._events).toEqual @events
      And -> expect(events.EventEmitter.prototype.emit.apply).toHaveBeenCalled()#With @receiver, ['received', @message]

    describe '#in (message:Message)', ->

      Given -> spyOn(@driver,['_step'])
      When -> @driver.in @message
      Then -> expect(@driver._step).toHaveBeenCalledWith @bus.incomming(), @message

    describe '#on (message:Message)', ->

      Given -> spyOn(@driver,['_step'])
      When -> @driver.on @message
      Then -> expect(@driver._step).toHaveBeenCalledWith @bus.processing(), @message

    describe '#out (message:Message)', ->

      Given -> spyOn(@driver,['_step'])
      When -> @driver.out @message
      Then -> expect(@driver._step).toHaveBeenCalledWith @bus.outgoing(), @message

    describe '#done (cb:Function)', ->

      Given -> @driver.in @message
      Given -> @driver.on @message
      Given -> @driver.out @message
      Given (done) -> @driver.done (err, message) -> done()
      Then -> expect(@message.target()).toBe 'everyone'
      And -> expect(@message.content()).toBe 'HI!!!'
