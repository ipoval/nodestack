
/**
 * Module dependencies
 */

var mongo = require('mongodb')
var assert = require('assert')

/**
 * Connect
 */

mongo.connect('mongodb://localhost/js-saturday', { db: { safe: true }}, onConnect);

/**
 * Db reference
 */

var db;

/**
 * Connection handler
 */

function onConnect (err, db_) {
  assert.ifError(err);

  console.log('connected!');

  // expose
  db = db_;

  return done();
  insert();
}

function insert () {
  // ref to the movies collection
  var movies = db.collection('movies');

  // add some movies
  var docs = [{ name: 'Frankenweenie' }, { name: 'Wreck-it Ralph' }];

  movies.insert(docs, function (err) {
    if (err) return done(err);

    console.log('inserted');

    find({ name: 'Frankenweenie' }, update);
  });
}

function find (match, cb) {
  return done();

  var movies = db.collection('movies');
  var cursor = movies.find(match);

  cursor.toArray(function (err, docs) {
    if (err) return done(err);
    console.log('found', docs);
    cb();
  });
}

function update () {
  return done();

  var movies = db.collection('movies');
  movies.update({ name: /ra/i }, { $set: { year: 2012 }}, function (err, res) {
    if (err) return done(err);

    console.log('updated %d docs', res);

    find({ }, done);
  });
}

/**
 * Close the connection
 */

function done (err) {
  if (err) console.error(err.stack);
  var movies = db.collection('movies');
  movies.remove({}, function () {
    db.close();
  })
}
