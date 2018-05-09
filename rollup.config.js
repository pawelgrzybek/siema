import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';

const es5 = {
  input: './src/siema.js',
  plugins: [
    babel(),
    uglify(),
  ],
  output: {
    file: 'dist/siema.min.js',
    format: 'umd',
    sourcemap: true,
    name: 'Siema',
  }
};

const es6 = {
  input: './src/siema.js',
  plugins: [
    babel(),
    uglify(),
  ],
  output: {
    file: 'dist/siema.es.js',
    sourcemap: true,
    format: 'es',
  }
};

export default [es5, es6];
