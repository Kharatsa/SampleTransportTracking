'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const nodemon = require('gulp-nodemon');
const watchify = require('watchify');
const browserify = require('browserify');
const babelify = require('babelify');
const envify = require('envify/custom');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const config = require('app/config');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// add custom browserify options here
const browserifyOptions = {
  entries: ['app/client/index.js'],
  extensions: ['.jsx'],
  debug: !IS_PRODUCTION
};
const opts = Object.assign({}, watchify.args, browserifyOptions);
var bundler = browserify(opts);
bundler.transform(babelify.configure({
  presets: ['react', 'es2015'],
  plugins: []
}));

bundler.transform(envify({
  NODE_ENV: process.env.NODE_ENV
}));

var uglify = function() {
  return $.uglify().on('error', $.util.log);
};

function bundle() {
  return bundler.bundle()
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
      .pipe(IS_PRODUCTION ? uglify() : $.util.noop())
      .pipe($.filesize())
    .pipe(gulp.dest(config.server.PUBLIC_PATH));
}

bundler.on('log', $.util.log); // output build logs to terminal
gulp.task('bundle', bundle); // so you can run `gulp js` to build the file

gulp.task('development', function() {
  bundler = watchify(bundler);
  bundler.on('update', bundle); // on any dep update, runs the bundler
  return;
});

gulp.task('lint', function() {
  return gulp.src([
    'app/**/*.js', '!app/public/**'
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
      'app/client/**/*',
      'app/assets/**/*',
      'app/public/**/*',
      'app/maintenance/**/*',
      'test/**/*',
      'docs/**/*'
    ],
    execMap: {
      js: 'BLUEBIRD_WARNINGS=0 node --harmony'
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

const vendors = [
  'bower_components/pure/pure-min.css',
  'bower_components/pure/grids-responsive-min.css',
  'node_modules/fixed-data-table/dist/fixed-data-table.min.css',
  'node_modules/react-datepicker/dist/react-datepicker.min.css'
];

const vendorsDev = [
  'bower_components/pure/pure.css',
  'bower_components/pure/grids-responsive.css',
  'node_modules/fixed-data-table/dist/fixed-data-table.css',
  'node_modules/react-datepicker/dist/react-datepicker.css'
];

gulp.task('styles:vendors', () => {
  const vendorsSource = IS_PRODUCTION ? vendors : vendorsDev;
  return gulp.src(vendorsSource)
    .pipe($.concat('vendor.css'))
    .pipe($.filesize())
    .pipe(gulp.dest(config.server.PUBLIC_PATH + '/lib'));
});

const clientCSS = [
  'app/client/styles/**/*.css'
];

gulp.task('styles', ['styles:vendors'], function() {
  const loadSourceMaps = (
    IS_PRODUCTION ? $.util.noop : $.sourcemaps.init.bind({loadMaps: true}));
  const cssMinify = IS_PRODUCTION ? $.cssnano : $.util.noop;
  const writeSourceMaps = IS_PRODUCTION ? $.util.noop : $.sourcemaps.write;

  return gulp.src(clientCSS)
  .pipe(loadSourceMaps())
  .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
  .pipe($.concat('app.css'))
  .pipe(cssMinify())
  .pipe(writeSourceMaps())
  .pipe($.filesize())
  .pipe(gulp.dest(config.server.PUBLIC_PATH));
});

gulp.task('styles:watch', () => gulp.watch(clientCSS, ['styles']));

gulp.task('static:schemas', () => {
  return gulp.src(schemas)
  .pipe(gulp.dest(config.server.PUBLIC_PATH + '/schemas'));
});

const xforms = ['app/assets/xforms/*.xml'];

gulp.task('static:xforms', () => {
  return gulp.src(xforms)
  .pipe(gulp.dest(config.server.PUBLIC_PATH + '/xforms'));
});

const metadata = ['app/assets/xforms/metadata/*.csv'];

gulp.task('static:metadata', () => {
  return gulp.src(metadata)
  .pipe(gulp.dest(config.server.PUBLIC_PATH + '/xforms/metadata'));
});

const iconic = [
  'bower_components/open-iconic/svg/*',
  'bower_components/open-iconic/png/*'
];

gulp.task('static:iconic', () => {
  return gulp.src(iconic)
  .pipe(gulp.dest(config.server.PUBLIC_PATH + '/icons'));
});

const stats = 'bower_components/memory-stats/memory-stats.js';

gulp.task('static:debugstats', () => {
  return gulp.src([stats])
  .pipe($.concat('debug.js'))
  .pipe(uglify())
  .pipe(gulp.dest(config.server.PUBLIC_PATH + '/lib'));
});

const html = 'app/client/**/*.html';
const favicon = 'app/assets/favicon.ico';
const robots = 'app/assets/robots.txt';
const fonts = 'app/assets/fonts';
const schemas = 'app/assets/schemas/**/*';

const preStatic = [
  'static:schemas',
  'static:xforms',
  'static:metadata',
  'static:debugstats',
  'static:iconic'
];

gulp.task('static', preStatic, () => {
  return gulp.src([html, favicon, fonts, robots])
    .pipe(gulp.dest(config.server.PUBLIC_PATH));
});

gulp.task('static:watch', () =>
  gulp.watch([html, favicon, fonts, schemas], ['static'])
);

gulp.task('watch', ['static:watch', 'styles:watch']);

gulp.task('clean', () =>
  gulp.src([
    'app/public/**/*+(js|map|css|html|ico|txt)',
    'app/public/schemas',
    'app/public/xforms',
    'app/public/fonts',
    'app/public/lib',
    'app/public/icons'
  ], {read: false})
    .pipe($.rimraf())
);

gulp.task('default',
  ['development', 'nodemon', 'watch', 'bundle', 'static', 'styles']
);

gulp.task('build',
  ['bundle', 'styles', 'static']
);
