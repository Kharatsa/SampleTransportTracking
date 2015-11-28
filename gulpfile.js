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
const config = require('app/config.js');

var isDevelopment = !config.isProduction;

// add custom browserify options here
const browserifyOptions = {
  entries: ['app/client/index.js'],
  debug: isDevelopment,
  extensions: ['.jsx']
};
const opts = assign({}, watchify.args, browserifyOptions);
var bundler = browserify(opts);
bundler.transform(babelify.configure({presets: [
  'react',
  'es2015'
]}));

function bundle() {
  return bundler.bundle()
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
      .pipe(isDevelopment ? $.util.noop() : $.uglify().on('error', $.util.log))
      .pipe($.filesize())
      .pipe(isDevelopment ? $.sourcemaps.init({loadMaps: true}) : $.util.noop())
      .pipe(isDevelopment ? $.sourcemaps.write('./') : $.util.noop())
    .pipe(gulp.dest('app/server/public'));
}

bundler.on('log', $.util.log); // output build logs to terminal
gulp.task('bundle', bundle); // so you can run `gulp js` to build the file

gulp.task('development', function() {
  isDevelopment = true;
  bundler = watchify(bundler);
  bundler.on('update', bundle); // on any dep update, runs the bundler
  return;
});

gulp.task('production', function() {
  isDevelopment = false;
  return;
});

gulp.task('lint', function() {
  return gulp.src(['app/**/*.js', '!app/server/public/**'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.results(function(results) {
      // Called once for all ESLint results.
      $.util.log('Total Results: ' + results.length);
      $.util.log('Total Warnings: ' + results.warningCount);
      $.util.log('Total Errors: ' + results.errorCount);
    }));
});

const clientCSS = 'app/client/**/*.css';
gulp.task('styles', function() {
  return gulp.src(clientCSS)
  .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
  .pipe($.concat('app.css'))
  .pipe($.filesize())
  .pipe(gulp.dest('app/server/public'));
});

gulp.task('nodemon', ['lint'], function(cb) {
  var started = false;
  return nodemon({
    script: 'app/server/server.js',
    verbose: true,
    ignore: [
      '.git/*',
      'README.md',
      'gulpfile.js',
      'junkyard/*',
      'app/client/**/*.js',
      'app/server/public/**/*'
    ],
    execMap: {
      js: 'node --harmony'
    }
  }).on('start', function() {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb();
      started = true;
    }
  });
});

const clientHTML = 'app/client/**/*.html';
gulp.task('static', ['clean'], function() {
  return gulp.src(clientHTML)
    .pipe($.filesize())
    .pipe(gulp.dest('app/server/public'));
});

gulp.task('watchStyles', function() {
  return gulp.watch(clientCSS, ['styles']);
});
gulp.task('watchStatic', function() {
  return gulp.watch(clientHTML, ['static']);
});
gulp.task('watch', ['watchStatic', 'watchStyles']);

gulp.task('clean', function() {
  return gulp.src('app/server/public/**/*.+(js|map|css|html)', {read: false})
    .pipe($.rimraf());
});

gulp.task('default',
  ['development', 'nodemon', 'watch', 'bundle', 'static', 'styles']
);

gulp.task('build',
  ['production', 'bundle', 'styles', 'static']
);
