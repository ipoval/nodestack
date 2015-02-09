/**
 * Module dependencies
 */
var assert = require('assert')
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

/**
 * connect
 */
mongoose.connect('mongodb://localhost/js-saturday', function(err) {
  assert.ifError(err);
  console.log('connected');

  //return done();
  setup7();
});

function setup0() {
  // declare our schema
  var movieSchema = new Schema({ name: String, year: Number });

  // compile a model
  mongoose.model('Movie', movieSchema);
  insert();
}

function setup1() {
  var movieSchema = new Schema({ name: String, year: { type: Number, required: true } });

  // compile a model
  mongoose.model('Movie', movieSchema);
  insert();
}

function setup2() {
  var movieSchema = new Schema({ name: String, year: { type: Number, required: true, min: 1900 } });

  // compile a model
  mongoose.model('Movie', movieSchema);
  insert();
}

function setup3() {
  var movieSchema = new Schema({ name: String, year: { type: Number, required: true, min: 1900 } });

  movieSchema.pre('validate', function (next) {
    if (1860 === this.year) {
      this.year = 2012;
    }
    next();
  });

  // compile a model
  mongoose.model('Movie', movieSchema);
  insert();
}

function setup4() {
  var movieSchema = new Schema({ name: String, year: { type: Number, required: true, min: 1900 } });

  movieSchema.pre('validate', function (next) {
    if (1860 === this.year) {
      this.year = 2012;
    }
    next();
  });

  movieSchema.pre('save', function (next) {
    // capitalize
    this.name = this.name.charAt(0).toUpperCase() + this.name.substring(1);
    next();
  });

  // compile a model
  mongoose.model('Movie', movieSchema);
  insert();
}

function setup5 () {
  var movieSchema = new Schema({ name: String, year: { type: Number, required: true, min: 1900 } });

  movieSchema.pre('validate', function (next) {
    if (1860 === this.year) {
      this.year = 2012;
    }
    next();
  });

  // captialize with setter
  movieSchema.path('name').set(function (v) {
    var name = 'string' == typeof v ? v : '';

    return name.charAt(0).toUpperCase() + name.substring(1);
  })

  // compile a model
  mongoose.model('Movie', movieSchema);
  insert();
}

function setup6 () {
  var movieSchema = new Schema({ name: String, year: { type: Number, required: true, min: 1900 } });

  movieSchema.pre('validate', function (next) {
    if (1860 === this.year) {
      this.year = 2012;
    }
    next();
  });

  // captialize with setter
  movieSchema.path('name').set(function (v) {
    var name = 'string' == typeof v ? v : '';

    return name.charAt(0).toUpperCase() + name.substring(1);
  });

  // first enable find() example and following
  movieSchema.statics.findByYear = function (year, cb) {
    return this.find({ year: year }, cb);
  }

  // compile a model
  mongoose.model('Movie', movieSchema);
  insert();
}

function setup7 () {
  var movieSchema = new Schema({ name: String, year: { type: Number, required: true, min: 1900 } });

  movieSchema.pre('validate', function (next) {
    if (1860 === this.year) {
      this.year = 2012;
    }
    next();
  });

  // captialize with setter
  movieSchema.path('name').set(function (v) {
    var name = 'string' == typeof v ? v : '';

    return name.charAt(0).toUpperCase() + name.substring(1);
  });

  // first enable find() example and following
  movieSchema.statics.findByYear = function (year, cb) {
    return this.find({ year: year }, cb);
  }

  // custom document methods
  movieSchema.methods.findOthersWithSameYear = function (cb) {
    var match = { year: this.year, _id: { $ne: this._id }};
    return this.constructor.find(match, cb);
  }

  // compile a model
  mongoose.model('Movie', movieSchema);
  insert();
}

function setup8 () {
  // directors
  var directorSchema = new Schema({
      name: String
    , bio: {
          age: Number
        , desc: String
      }
  });
  var Director = mongoose.model('Director', directorSchema);

  // movies
  var movieSchema = new Schema({ name: String, year: { type: Number, required: true, min: 1900 }, _director: Schema.Types.ObjectId });
  var Movie = mongoose.model('Movie', movieSchema);

  // create a director + movie
  var johndoe = new Director({ name: 'John Doe', bio: { age: 39, desc: 'John Doe loves directing movies. Its true.' } });

  johndoe.save(function (err) {
    if (err) return done(err)

    var movie = new Movie({
        name: 'Anonymous'
      , year: 2013
      , _director: johndoe._id
    })

    movie.save(function (err) {
      if (err) return done(err);
      query(movie._id);
    })
  });

  function query (id) {
    Movie.findById(id, function (err, movie) {
      if (err) return done(err);
      Director.findById(movie._director, function (err, dir) {
        if (err) return done(err);
        console.log('director:', dir);
        console.log('movie:', movie);
        done();
      })
    })
  }
}

function setup9() {
  // directors + movies with population

  var directorSchema = new Schema({
      name: String
    , bio: {
          age: Number
        , desc: String
      }
  });
  var Director = mongoose.model('Director', directorSchema);

  // movies
  var movieSchema = new Schema({
      name: String
    , year: { type: Number, required: true, min: 1900 }
    , _director: { type: Schema.Types.ObjectId, ref: 'Director' }
  });
  var Movie = mongoose.model('Movie', movieSchema);

  // create a director + movie
  var johndoe = new Director({
      name: 'John Doe'
    , bio: {
        age: 39
      , desc: 'John Doe loves directing movies. Its true.'
    }
  });

  johndoe.save(function (err) {
    if (err) return done(err)

    var movie = new Movie({
        name: 'Anonymous'
      , year: 2013
      , _director: johndoe // casting!
    })

    movie.save(function (err) {
      if (err) return done(err);
      query(movie._id);
    })
  });

  function query (id) {
    Movie.findById(id).populate('_director').exec(function (err, movie) {
      if (err) return done(err);
      console.log('movie:', movie);
      done();
    })
  }
}

function insert () {
  // ref to the Movie model
  var Movie = mongoose.model('Movie');

  // create a movie
  var argo = new Movie({ name: 'argo', year: '2012' });

  argo.save(function (err) {
    if (err) return done(err);
    console.log('saved', argo);
    find();
  })
}

function find () {
  //return done();

  var Movie = mongoose.model('Movie');

  Movie.find({ year: { $gt: 2000 }}, function (err, docs) {
    if (err) return done(err);
    console.log('found', docs);
    return done();

    afterFind();
  });
}

function afterFind () {
  var arr = [ { name: 'The Artist', year: 2011 }
            , { name: 'Wreck-it Ralph', year: 2012 }]
  create(arr, statics);
}

function create (docs, cb) {
  //return done();

  var Movie = mongoose.model('Movie');
  Movie.create(docs, function (err, doc) {
    if (err) return done(err);
    console.log('created:', [].slice.call(arguments, 1));
    cb();
  });
}

function statics() {
  var Movie = mongoose.model('Movie');

  Movie.findByYear(2012, function (err, docs) {
    if (err) return done(err);
    console.log('static', docs);
    staticQuery();
  })
}

function staticQuery () {
  var Movie = mongoose.model('Movie');

  Movie.findByYear(2012).where('name', /^Wreck/).exec(function (err, movies) {
    if (err) return done(err);
    console.log('static + query', movies);
    documentMethods();
  })
}

function documentMethods () {
  //return done();

  var Movie = mongoose.model('Movie');

  Movie.findOne({ name: 'Wreck-it Ralph' }, function (err, doc) {
    if (err) return done(err);

    doc.findOthersWithSameYear(function (err, docs) {
      if (err) return done(err);

      console.log('documentMethods: withSameYear', docs);
      done();
    });
  })
}

function done (err) {
  if (err) console.error(err.stack);
  mongoose.model('Movie').remove(function () {
    mongoose.disconnect();
  })
}
