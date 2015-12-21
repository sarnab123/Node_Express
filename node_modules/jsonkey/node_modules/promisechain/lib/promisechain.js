/*
 * promisechain
 * https://github.com/georgeosddev/promisechain
 *
 * license   The MIT License (MIT)
 * copyright Copyright (c) 2014 Takeharu Oshida <georgeosddev@gmail.com>
 */
(function() {
  "use strict";
  var P = typeof Promise !== "undefined" ? Promise :
    typeof require === "function" ? require("es6-promise").Promise : null;
  var Underscore = typeof _ !== "undefined" ? _ :
    typeof require === "function" ? require("underscore") : null;

  if (!P || !Underscore) {
    return false;
  }

  function chainable(p) {
    p.filter = _filter(p);
    p.pipe = _pipe(p);
    p.recovery = _recovery(p);

    p.map = _map(p);
    p.reduce = _reduce(p);

    p.first = p.head = p.take = _first(p);
    p.initial = _initial(p);
    p.last = _last(p);
    p.rest = p.tail = p.drop = _rest(p);

    p.keys = _keys(p);
    p.values = _values(p);
    p.pairs = _pairs(p);
    return p;
  }

  function _filter(p) {
    return function(predicate) {
      var p2 = p.then(function(v) {
        if (Underscore.isFunction(predicate)) {
          if (predicate(v)) {
            return P.resolve(v);
          } else {
            return P.reject(null);
          }
        } else {
          if (v === predicate) {
            return P.resolve(v);
          } else {
            return P.reject(null);
          }
        }
      }, function() {
        return P.reject(null);
      });
      return chainable(p2);
    };
  }

  function _pipe(p) {
    return function(f) {
      var p2 = p.then(function(v) {
        if (Underscore.isFunction(f)) {
          return P.resolve(f(v));
        } else {
          return P.reject(null);
        }
      }, function() {
        return P.reject(null);
      });
      return chainable(p2);
    };
  }

  function _recovery(p) {
    return function(f) {
      var p2 = p.then(function(v) {
        return P.resolve(v);
      }, function(err) {
        return Underscore.isFunction(f) ? P.resolve(f(err)) : P.resolve(f);
      });
      return chainable(p2);
    };
  }

  function _map(p) {
    return function() {
      var args = Array.prototype.slice.apply(arguments);
      var p2 = p.then(function(v) {
        return P.resolve(Underscore.map.apply(null, [v].concat(args)));
      }, function() {
        return P.reject(null);
      });
      return chainable(p2);
    };
  }

  function _reduce(p) {
    return function() {
      var args = Array.prototype.slice.apply(arguments);
      var p2 = p.then(function(v) {
        return P.resolve(Underscore.reduce.apply(null, [v].concat(args)));
      }, function() {
        return P.reject(null);
      });
      return chainable(p2);
    };
  }

  function _first(p) {
    return function() {
      var args = Array.prototype.slice.apply(arguments);
      var p2 = p.then(function(v) {
        return P.resolve(Underscore.first.apply(null, [v].concat(args)));
      }, function() {
        return P.reject(null);
      });
      return chainable(p2);
    };
  }

  function _initial(p) {
    return function() {
      var args = Array.prototype.slice.apply(arguments);
      var p2 = p.then(function(v) {
        return P.resolve(Underscore.initial.apply(null, [v].concat(args)));
      }, function() {
        return P.reject(null);
      });
      return chainable(p2);
    };
  }

  function _last(p) {
    return function() {
      var args = Array.prototype.slice.apply(arguments);
      var p2 = p.then(function(v) {
        return P.resolve(Underscore.last.apply(null, [v].concat(args)));
      }, function() {
        return P.reject(null);
      });
      return chainable(p2);
    };
  }

  function _rest(p) {
    return function() {
      var args = Array.prototype.slice.apply(arguments);
      var p2 = p.then(function(v) {
        return P.resolve(Underscore.rest.apply(null, [v].concat(args)));
      }, function() {
        return P.reject(null);
      });
      return chainable(p2);
    };
  }

  function _keys(p) {
    return function() {
      var args = Array.prototype.slice.apply(arguments);
      var p2 = p.then(function(v) {
        return P.resolve(Underscore.keys.apply(null, [v].concat(args)));
      }, function() {
        return P.reject(null);
      });
      return chainable(p2);
    };
  }

  function _values(p) {
    return function() {
      var args = Array.prototype.slice.apply(arguments);
      var p2 = p.then(function(v) {
        return P.resolve(Underscore.values.apply(null, [v].concat(args)));
      }, function() {
        return P.reject(null);
      });
      return chainable(p2);
    };
  }

  function _pairs(p) {
    return function() {
      var args = Array.prototype.slice.apply(arguments);
      var p2 = p.then(function(v) {
        return P.resolve(Underscore.pairs.apply(null, [v].concat(args)));
      }, function() {
        return P.reject(null);
      });
      return chainable(p2);
    };
  }

  module.exports = {
    chainable: chainable
  };
})();