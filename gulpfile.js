'use strict';

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('nodemon', function(cb) {
  var started = false;

  return nodemon({
    script: 'app/server/server.js',
    verbose: true,
    ignore: [
      'README.md'
      'app/client/**/*.js',
      '.git/*',
      'tmp/*',
      'app/data'
    ],
    execMap: {
      js: 'node --harmony'
    },
  }).on('start', function() {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('default', ['nodemon']);
