'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const nodemon = require('gulp-nodemon');
const watchify = require('watchify');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const assign = require('lodash').assign;
const stylish = require('jshint-stylish');
const config = require('app/config.js');

// add custom browserify options here
const customOptions = {
  entries: ['app/client/index.js'],
  debug: !config.isProduction,
};
const opts = assign({}, watchify.args, customOptions);
const bundler = watchify(browserify(opts));
bundler.transform(babelify.configure({
  presets: ['react']
}));

gulp.task('lint', function() {
  return gulp.src(['app/**/*.js', '!app/server/public/**'])
    .pipe($.jshint())
    .pipe($.jshint.reporter(stylish));
});

function bundle() {
  return bundler.bundle()
    // log errors if they happen
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe($.filesize())
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // produce sourcemaps in development
    .pipe(
      (!config.isProduction) ?
      $.sourcemaps.init({loadMaps: true}) :
      $.util.noop()
    )
     // Add transformation tasks to the pipeline here.
    .pipe(
      (!config.isProduction) ?
      $.sourcemaps.write('./') :
      $.util.noop()
    )
    // .pipe($.filesize())
    // .pipe($.sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('app/server/public'));
}

bundler.on('update', bundle); // on any dep update, runs the bundler
bundler.on('log', $.util.log); // output build logs to terminal
gulp.task('bundle', bundle); // so you can run `gulp js` to build the file

gulp.task('styles', function() {
  var clientCSS = 'app/client/**/*.css';
  gulp.src(clientCSS)
  .pipe($.watch(clientCSS))
  .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
  .pipe($.concat('app.css'))
  .pipe($.filesize())
  .pipe(gulp.dest('app/server/public'));
});

gulp.task('nodemon', function(cb) {
  var started = false;
  return nodemon({
    script: 'app/server/server.js',
    verbose: true,
    ignore: [
      '.git/*',
      'README.md',
      'junkyard/*',
      'app/client/**/*.js',
      'app/server/public/**',
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

gulp.task('copy', function() {
  var clientHTML = 'app/client/**/*.html';
  return gulp.src(clientHTML)
    .pipe($.watch(clientHTML))
    .pipe(gulp.dest('app/server/public'));
});

gulp.task('default', ['nodemon', 'copy', 'lint', 'bundle', 'styles']);
