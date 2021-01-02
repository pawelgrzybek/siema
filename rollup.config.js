import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const nomodule = {
  input: './src/siema.js',
  plugins: [
    babel(),
    uglify(),
  ],
  output: {
    file: 'dist/siema.nomodule.js',
    format: 'umd',
    sourcemap: true,
    name: 'Siema',
  }
};

const es5 = {
  input: './src/siema.js',
  plugins: [
    babel(),
  ],
  output: {
    file: 'dist/siema.es5.js',
    format: 'es',
    sourcemap: true,
  }
};

const es6 = {
  input: './src/siema.js',
  output: {
    file: 'dist/siema.es.js',
    sourcemap: true,
    format: 'es',
  }
};

export default [nomodule, es5, es6];
