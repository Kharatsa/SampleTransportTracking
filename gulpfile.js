'use strict';

const path = require('path');
require('app-module-path').addPath(path.join(__dirname, 'app'));

const _ = require('lodash');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const watchify = require('watchify');
const browserify = require('browserify');
const babelify = require('babelify');
const envify = require('envify/custom');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const config = require('config');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_DEVELOPMENT = !IS_PRODUCTION;
const ENV = process.env.NODE_ENV || 'development';

const browserifyOptions = {
  entries: ['app/client'],
  extensions: ['.jsx'],
  debug: IS_DEVELOPMENT,
};
const watchifyOptions = {
  ignoreWatch: ['./node_modules/**'],
};
const bundlerOptions = _.assign(
  {}, watchify.args, watchifyOptions, browserifyOptions);
const globals = _.assign({NODE_ENV: process.env.NODE_ENV}, config.common);

let bundler = (browserify(bundlerOptions)
               .transform(babelify.configure({babelrc: true}))
               .transform(envify(globals)));

let uglify = function() {
  return $.uglify().on('error', (err) => {
    $.util.log(err);
    if (IS_PRODUCTION) {
      throw err;
    }
  });
};

const bundle = () => {
  return bundler.bundle()
    .on('error', (err) => {
      $.util.log(err);
      if (IS_PRODUCTION) {
        throw err;
      }
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(IS_PRODUCTION ? $.util.noop() : $.sourcemaps.init({loadMaps: true}))
      .pipe(IS_PRODUCTION ? uglify() : $.util.noop())
      .pipe($.filesize())
    .pipe(IS_PRODUCTION ? $.util.noop() : $.sourcemaps.write('./'))
    .pipe(gulp.dest(config.server.PUBLIC_PATH));
};

gulp.task('bundle', ['lint'], bundle); // so you can run `gulp js` to build the file

gulp.task('bundle:watch', () => {
  bundler = watchify(bundler);
  bundler.on('update', bundle); // on any dep update, runs the bundler
  bundler.on('log', $.util.log); // output build logs to terminal
  return;
});

gulp.task('lint', () => {
  return gulp.src([
    'app/**/*.js', '!app/public/**'
  ])
  .pipe($.eslint())
  .pipe($.eslint.format())
  .pipe($.eslint.results((results) => {
    $.util.log(`Scanned: ${results.length}`);
    $.util.log(`Warnings: ${results.warningCount}`);
    $.util.log(`Errors: ${results.errorCount}`);
  }));
});

const vendorStyles = {
  production: [
    'bower_components/pure/pure-min.css',
    'bower_components/pure/grids-responsive-min.css',
    'node_modules/fixed-data-table/dist/fixed-data-table.min.css',
    'node_modules/chartist/dist/chartist.min.css',
    'node_modules/react-datepicker/dist/react-datepicker.min.css',
    'node_modules/react-virtualized/styles.css',
  ],
  development: [
    'bower_components/pure/pure.css',
    'bower_components/pure/grids-responsive.css',
    'node_modules/fixed-data-table/dist/fixed-data-table.css',
    'node_modules/chartist/dist/chartist.css',
    'node_modules/react-datepicker/dist/react-datepicker.css',
    'node_modules/react-virtualized/styles.css',
  ]
};

gulp.task('styles:vendors', () => {
  return gulp.src(vendorStyles[ENV])
    .pipe($.concat('vendor.css'))
    .pipe($.filesize())
    .pipe(gulp.dest(`${config.server.PUBLIC_PATH}/lib`));
});

const appStyles = 'app/client/**/*.css';

gulp.task('styles:app', () => {
  const initSourceMap = $.sourcemaps.init.bind({loadMaps: true});

  return gulp.src(appStyles)
    .pipe(IS_DEVELOPMENT ? initSourceMap() : $.util.noop())
    .pipe($.autoprefixer('last 2 version'))
    .pipe($.concat('app.css'))
    .pipe(IS_PRODUCTION ? $.cssnano() : $.util.noop())
    .pipe(IS_DEVELOPMENT ? $.sourcemaps.write() : $.util.noop())
    .pipe($.filesize())
    .pipe(gulp.dest(config.server.PUBLIC_PATH));
});

gulp.task('styles', ['styles:app', 'styles:vendors']);
gulp.task('styles:watch', () => gulp.watch(appStyles, ['styles']));

const copy = (src, dest) => () => {
  return gulp.src(src)
    .pipe(gulp.dest(`${config.server.PUBLIC_PATH}/${dest}`));
};

gulp.task('static:schemas', copy('app/assets/schemas/**/*', 'schemas'));
gulp.task('static:xforms', copy('app/assets/xforms/*.xml', 'xforms'));
gulp.task('static:metadata', copy('app/assets/**/*.csv', 'xforms/metadata'));

const iconicStatic = [
  'bower_components/open-iconic/svg/*',
  'bower_components/open-iconic/png/*',
  'bower_components/open-iconic/sprite/*',
];
gulp.task('static:iconic', copy(iconicStatic, 'icons'));

const appStatic = [
  'app/client/**/*.html',
  'app/assets/favicon.ico',
  'app/assets/robots.txt',
  'app/assets/fonts',
  'app/assets/schemas/**/*',
];
gulp.task('static:app', copy(appStatic, ''));

gulp.task('static',
  [
    'static:schemas',
    'static:xforms',
    'static:metadata',
    'static:iconic',
    'static:app',
  ]);

gulp.task('static:watch', () => gulp.watch(appStatic, ['static']));

gulp.task('clean', () =>
  gulp.src(
    [
      'app/public/**/*+(js|map|css|html|ico|txt)',
      'app/public/schemas',
      'app/public/xforms',
      'app/public/fonts',
      'app/public/lib',
      'app/public/icons'
    ],
    {read: false})
  .pipe($.rimraf())
);

gulp.task('watch', ['bundle:watch', 'static:watch', 'styles:watch']);
gulp.task('default', ['bundle', 'static', 'styles', 'watch']);
gulp.task('build', ['bundle', 'styles', 'static']);
