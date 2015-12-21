# Promisechain [![Build Status](https://travis-ci.org/georgeOsdDev/promisechain.svg?branch=master)](https://travis-ci.org/georgeOsdDev/promisechain) [![npm version](https://badge.fury.io/js/promisechain.svg)](http://badge.fury.io/js/promisechain)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/promisechain.svg)](https://saucelabs.com/u/promisechain)

#### Chain-able promise with functional programming style.

[Promise](https://developer.mozilla.org/ja/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Promise) provides chain mechanism with `then` function.
But its writing is a little annoying.
This library enable more lazy way.

```javascript
var p = Promise(function(resolve, reject){
  setTimeout(function(){
    resolve([1,2,3,4,5]);
  }, 10);
})

Promisechain.chainable(p)
.map(function(v){
  return v*2;
})
.reduce(function(acc, v) {
  return acc + v;
}, 0)
.filter(function(v) {
  return v > 20;
})
.recovery(99)
.pipe(function(v) {
  return {result :v};
})
.then(function(v){
  console.log(v);
});
// => {result:30}
```


## Usage

### In Browser

Use bower.
```bash
bower isntall promisechain
```

```html
<script src="./bower_components/promisechain/dist/promisechain_bundle.js"></script>
```
`Promisechain` will be installed to global.

Or use `require` style with [browserify](http://browserify.org/).

### In Node.js
Use npm.

```bash
npm isntall promisechain
```

```javascript
var chainable = require("promisechain").chainable;
```

## API

### `Promisechain.chainable(p Promise)`

  Add chain-able methods to `p`.
  All chain-able methods return chain-able promise.

### Basic Chain-able methods

* #### `filter(predicate Function)`

  Filter value with provided predicate.
  If predicate is not `function`, `===` operator will be used as predicate.

  ```javascript
  chainable(p)
  .filter(function(v) {
    return v > 20;
  });
  .then(
    function(v){console.log("This block will be called when v > 20");},
    function(){console.log("This block will be called when v <= 20");}
  );
  ```

  ```javascript
  chainable(p)
  .filter("HELLO");
  .then(
    function(v){console.log("This block will be called when v === 'HELLO'");},
    function(){console.log("This block will be called when v !== 'HELLO'");}
  );
  ```

  **Notice**
  Unlike `underscore`'s' or `lodash`'s `filter`, this `filter` method does not iterate value.
  Just apply predicator to value itself.
  If you want filter element of array, use `pipe` instead.
  ```javascript
  chainable(Promise.resolve([1,2,3,4,5]))
  .pipe(function(arr){
    return _.filter(arr, function(v){return v > 2;});
  })
  .then(function(){
    console.log(v); // => [3,4,5]
  });

  ```

* #### `pipe(func Function)`

  Pipe values to next step.

  ```javascript
  function double(v){ return v*2;}

  chainable(Promise.resolve(2))
  .pipe(double);
  .pipe(double);
  .then(
    function(v){console.log(v);} // => 8
  );
  ```

* #### `recovery(value Any)`

  Recovery promise chain when before steps are rejected.

  ```javascript
  chainable(Promise.resolve(2))
  .filter(function(){return v > 10;});
  .recovery(100);
  .then(
    function(v){console.log(v);}  // => 100,
    function(){console.log("This block will never be called");}
  );
  ```

### Collection Chain-able methods

These methods are alias to `underscore`'s basic collection utility.
Apply `underscore`'s method with arguments, then return chain-able promise.
What it is not listed here, You can use with `pipe` method.

**Noteice**
If invalid parameter is passed to `underscore`'s method,
Unless it throw `Error`, promise will not be rejected.
Generally it will return empty array `[]`. So promise chain will not be rejected but resolved with `[]`;


* #### `map`

  An alias of `underscore`'s' `map`.

  ```javascript
  function double(v){ return v*2;}

  chainable(Promise.resolve([1,2,3,4,5]))
  .map(double);
  .then(
    function(v){console.log(v);}  // => [2,4,6,8,10],
  );
  ```

* #### `reduce`

  An alias of `underscore`'s' `reduce`.

  ```javascript
  function sum(acc, v){ return v + acc;}

  chainable(Promise.resolve([1,2,3,4,5]))
  .reduce(sum, 0)
  .then(
    function(v){console.log(v);}  // => 15,
  );
  ```

* #### `first`, `head` and `take`

  An alias of `underscore`'s' `first`.

  ```javascript
  chainable(Promise.resolve([1,2,3,4,5]))
  .first()
  .then(
    function(v){console.log(v);}  // => 1,
  );
  ```

* #### `initial`

  An alias of `underscore`'s' `initial`.

  ```javascript
  chainable(Promise.resolve([1,2,3,4,5]))
  .initial()
  .then(
    function(v){console.log(v);}  // => [1,2,3,4],
  );
  ```

* #### `last`

  An alias of `underscore`'s' `last`.

  ```javascript
  chainable(Promise.resolve([1,2,3,4,5]))
  .last()
  .then(
    function(v){console.log(v);}  // => 5,
  );
  ```

* #### `rest`, `tail`, `drop`

  An alias of `underscore`'s' `rest`.

  ```javascript
  chainable(Promise.resolve([1,2,3,4,5]))
  .rest()
  .then(
    function(v){console.log(v);}  // => [2,3,4,5]
  );
  ```

* #### `keys`

  An alias of `underscore`'s' `keys`.

  ```javascript
  chainable(Promise.resolve({
    "key1": "val1",
    "key2": "val2"
  }))
  .keys()
  .then(
    function(v){console.log(v);}  // => ["key1", "key2"]
  );
  ```

* #### `values`

  An alias of `underscore`'s' `values`.

  ```javascript
  chainable(Promise.resolve({
    "key1": "val1",
    "key2": "val2"
  }))
  .values()
  .then(
    function(v){console.log(v);}  // => ["val1", "val2"]
  );
  ```

* #### `values`

  An alias of `underscore`'s' `values`.

  ```javascript
  chainable(Promise.resolve({
    "key1": "val1",
    "key2": "val2"
  }))
  .pairs()
  .then(
    function(v){console.log(v);}  // => [["key1","val1"], ["key2","val2"]
  );
  ```

## Development

Install Node.js and NPM.

```bash
git clone git://github.com/georegeosddev/promisechain.git
cd promisechain
npm install
npm run-script build
```

## Licence
MIT
