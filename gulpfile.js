'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const nodemon = require('gulp-nodemon');
const watchify = require('watchify');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const config = require('app/config');

var IS_DEVELOPMENT = !config.server.isProduction();

// add custom browserify options here
const browserifyOptions = {
  entries: [
    'app/client/index.js'
  ],
  debug: IS_DEVELOPMENT,
  extensions: ['.jsx']
};
const opts = Object.assign({}, watchify.args, browserifyOptions);
var bundler = browserify(opts);
bundler.transform(babelify.configure({presets: [
  'react',
  'es2015'
]}));

var uglify = function() {
  return $.uglify({compress: {
    'global_defs': {DEBUG: false}
  }}).on('error', $.util.log);
};

function bundle() {
  return bundler.bundle()
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
      .pipe(IS_DEVELOPMENT ? $.util.noop() : uglify())
      .pipe($.filesize())
      .pipe(IS_DEVELOPMENT ?
        $.sourcemaps.init({loadMaps: true}) :
        $.util.noop()
      )
      .pipe(IS_DEVELOPMENT ? $.sourcemaps.write('./') : $.util.noop())
    .pipe(gulp.dest(config.server.PUBLIC_PATH));
}

bundler.on('log', $.util.log); // output build logs to terminal
gulp.task('bundle', bundle); // so you can run `gulp js` to build the file

gulp.task('development', function() {
  IS_DEVELOPMENT = true;
  bundler = watchify(bundler);
  bundler.on('update', bundle); // on any dep update, runs the bundler
  return;
});

gulp.task('production', function() {
  IS_DEVELOPMENT = false;
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
      js: 'BLUEBIRD_WARNINGS=0 NODE_ENV=development node --harmony'
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
  .pipe(gulp.dest(config.server.PUBLIC_PATH));
});

const html = 'app/client/**/*.html';
const favicon = 'app/assets/favicon.ico';
const fonts = 'app/assets/fonts';
gulp.task('static', ['static:schemas'], () => {
  return gulp.src([html, favicon, fonts])
    .pipe($.filesize())
    .pipe(gulp.dest(config.server.PUBLIC_PATH));
});

const schemas = 'app/assets/schemas/**/*';
gulp.task('static:schemas', () => {
  return gulp.src(schemas)
  .pipe($.filesize())
  .pipe(gulp.dest(config.server.PUBLIC_PATH + '/schemas'));
});

gulp.task('styles:watch', () => gulp.watch(clientCSS, ['styles']));

gulp.task('static:watch', () =>
  gulp.watch([html, favicon, fonts, schemas], ['static'])
);

gulp.task('watch', ['static:watch', 'styles:watch']);

gulp.task('clean', () =>
  gulp.src([
    'app/public/**/*+(js|map|css|html|ico)',
    'app/public/schemas',
    'app/public/fonts'
  ], {read: false})
    .pipe($.rimraf())
);

gulp.task('default',
  ['development', 'nodemon', 'watch', 'bundle', 'static', 'styles']
);

gulp.task('build',
  ['production', 'bundle', 'styles', 'static']
);
