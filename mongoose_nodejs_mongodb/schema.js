
/**
 * Module dependencies
 */

var fs = require('fs')
var assert = require('assert')
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

/**
 * connect
 */

mongoose.connect('mongodb://localhost/jssaturday', function (err) {
  assert.ifError(err);
  console.log('connected');
  test();
});

function test () {
  // parse json
  var schema = require("./schema.json");

  // create schema
  var example = new Schema(schema[0], schema[1]);

  // compile model
  var M = mongoose.model('Stuff', example);

  // test document
  var m = new M({
      name: 'jsSaturday'
    , age: '1'
    , binary: new Buffer(11)
    , array: [1, 'two', [3], { four: true }]
    , subdocs: [{ title: 'yay' }]
  });

  console.log(m);

  done();
}

function done (err) {
  if (err) console.error(err.stack);
  //mongoose.model('Movie').remove(function () {
    mongoose.disconnect();
  //})
}
