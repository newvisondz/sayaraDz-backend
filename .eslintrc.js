module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true,
    'mocha': true
  },
  'plugins': ['mocha'],
  'extends': 'standard',
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 2018
  },
  'rules': {
    eqeqeq: 'off',
    "mocha/no-exclusive-tests": "error"

  }
}
