const rollup = require('rollup');
const utils = require('rollup-pluginutils');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');
// const UglifyJS = require('uglify-js');

const Immutable = require('immutable');
const React = require('react');
const ReactDOM = require('react-dom');
const ReduxDevTools = require('redux-devtools');
const STTWorkflow = require('./app/common/sttworkflow');

const sourceMap = process.env.NODE_ENV !== 'production';

let cache;

let startTime;

const startTimerPlugin = () => ({
  transform() {
    startTime = process.hrtime();
    return null;
  },
});

const customUglify = (options={}) => {
  return {
    name: 'uglify',

    transformBundle(source) {
      if (process.env.NODE_ENV !== 'production') {
        return null;
      }
      const context = 1000;

      options.fromString = true;
      let result;
      try {
        result = UglifyJS.minify(source, options);
      } catch (err) {
        const {line, pos, message} = err;
        console.log(`err line=${line}, pos=${pos}, message=${message}`);
        console.log(`err char=${source.charAt(pos)}`);

        const snippet = source.substr(pos - context, 2 * context);
        console.error(`UglifyJS ${message}\n${snippet}`);
      }
      return result ? result.code : null;
    },
  };
};

rollup.rollup({
  entry: 'app/client/index.js',
  cache: cache,
  plugins: [
    startTimerPlugin(),
    resolve({
      jsnext: true,
      module: true,
      main: true,
      extensions: ['.js', '.jsx'],
    }),
    commonjs({
      sourceMap,
      namedExports: {
        'node_modules/immutable/dist/immutable.js': Object.keys(Immutable),
        'node_modules/react/react.js': Object.keys(React),
        'node_modules/react-dom/index.js': Object.keys(ReactDOM),
        'node_modules/redux-devtools/lib/index.js': Object.keys(ReduxDevTools),
        'app/common/sttworkflow.js': Object.keys(STTWorkflow),
      },
    }),
    babel({
      ast: false,
      sourceMaps: sourceMap,
      exclude: ['node_modules/**', 'app/common/**'],
      babelrc: false,
      plugins: [
        'transform-object-rest-spread',
        'external-helpers',
      ],
      presets: [
        ['es2015', {modules: false}],
        'react',
      ],
    }),
    uglify({}),
  ],
}).then((bundle) => {
  cache = bundle;

  return bundle.write({
    dest: 'rollup.js',
    format: 'iife',
    sourceMap,
  });
})
.then(() => {
  const [seconds, nanoseconds] = process.hrtime(startTime);
  const milliseconds = nanoseconds / Math.pow(10, 6);
  console.log(`Finished writing bundle (${milliseconds}ms)`);
})
.catch((err) => {
  console.error(err);
});
