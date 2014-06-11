[![Build Status](https://travis-ci.org/turbonetix/bus.io-driver.svg?branch=master)](https://travis-ci.org/turbonetix/bus.io-driver)
[![NPM version](https://badge.fury.io/js/bus.io-driver.svg)](http://badge.fury.io/js/bus.io-driver)
[![David DM](https://david-dm.org/turbonetix/bus.io-driver.png)](https://david-dm.org/turbonetix/bus.io-driver.png)

![Bus.IO](https://raw.github.com/turbonetix/bus.io/master/logo.png)

Test driver your bus.io apps with driver.

# Installation and Environment Setup

Install node.js (See download and install instructions here: http://nodejs.org/).

Clone this repository

    > git clone git@github.com:turbonetix/bus.io-driver.git

cd into the directory and install the dependencies

    > cd bus.io-driver
    > npm install && npm shrinkwrap --dev

# Running Tests

Install coffee-script

    > npm install coffee-script -g

Tests are run using grunt.  You must first globally install the grunt-cli with npm.

    > sudo npm install -g grunt-cli

## Unit Tests

To run the tests, just run grunt

    > grunt spec

## TODO
