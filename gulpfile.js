'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const nodemon = require('gulp-nodemon');
const watchify = require('watchify');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
// const assign = require('lodash').assign;
const config = require('app/config.js');

var isDevelopment = !config.isProduction;

// add custom browserify options here
const browserifyOptions = {
  entries: [
    'app/client/index.js',
    // 'node_modules/material-design-lite/material.min.js'
  ],
  debug: isDevelopment,
  extensions: ['.jsx']
};
const opts = Object.assign({}, watchify.args, browserifyOptions);
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
  return gulp.src([
      'app/**/*.js',
      '!app/server/public/**',
      '!app/client/util/material.js'
    ])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.results(function(results) {
      // Called once for all ESLint results.
      $.util.log('Total Results: ' + results.length);
      $.util.log('Total Warnings: ' + results.warningCount);
      $.util.log('Total Errors: ' + results.errorCount);
    }));
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

const clientCSS = 'app/client/**/*.css';
gulp.task('styles', function() {
  return gulp.src(clientCSS)
  .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
  .pipe($.concat('app.css'))
  .pipe($.filesize())
  .pipe(gulp.dest('app/server/public'));
});


const clientSass = 'app/client/**/*.scss';
gulp.task('sass', function () {
  var sassOptions = isDevelopment ? {outputStyle: 'compressed'} : {};
  gulp.src([clientSass, clientCSS])
    .pipe(isDevelopment ? $.sourcemaps.init({loadMaps: true}) : $.util.noop())
    .pipe($.sass(sassOptions).on('error', $.sass.logError))
    .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe($.concat('app.css'))
    .pipe($.filesize())
    .pipe(isDevelopment ? $.sourcemaps.write('./') : $.util.noop())
    .pipe(gulp.dest('app/server/public'));
});

gulp.task('sass:watch', function () {
  gulp.watch(clientSass, ['sass']);
});

const clientHTML = 'app/client/**/*.html';
// const materialCSS = 'node_modules/material-design-lite/material.min.css';
// const materialStatic = 'node_modules/material-design-lite/material.min.js';
gulp.task('static', ['clean'], function() {
  return gulp.src([clientHTML])
    .pipe($.filesize())
    .pipe(gulp.dest('app/server/public'));
});

gulp.task('styles:watch', function() {
  return gulp.watch(clientCSS, ['styles']);
});
gulp.task('static:watch', function() {
  return gulp.watch(clientHTML, ['static']);
});
gulp.task('watch', ['static:watch', 'sass:watch', 'styles:watch']);

gulp.task('clean', function() {
  return gulp.src('app/server/public/**/*.+(js|map|css|html)', {read: false})
    .pipe($.rimraf());
});

gulp.task('default',
  ['development', 'nodemon', 'watch', 'bundle', 'static', 'sass']
);

gulp.task('build',
  ['production', 'bundle', 'sass', 'static']
);
