/*
 * JSONKey
 * https://github.com/georgeosddev/jsonkey
 *
 * license   The MIT License (MIT)
 * copyright Copyright (c) 2014 Takeharu Oshida <georgeosddev@gmail.com>
 */
(function() {
  "use strict";
  var util = require("util"),
    events = require("events"),
    chainable = require("promisechain").chainable;

  var P = typeof Promise !== "undefined" ? Promise : require("es6-promise").Promise;

  var JSONKEY_TIMEOUT = 100,
    JSONKEY_TIMEOUT_KEY = "[jsonkey_timeout]";

  function isObject(obj) {
    return obj instanceof Object && Object.getPrototypeOf(obj) === Object.prototype;
  }

  function nextTick(f) {
    setTimeout(f, 0);
  }

  /** @class JSONKey */
  /**
   * JSONKey
   * @constructor
   * @param {number} timeout default value is 100
   */
  var JSONKey = function(timeout) {
    this.timeout = timeout || JSONKEY_TIMEOUT;
    this._maxListeners = 0;
  };
  util.inherits(JSONKey, events.EventEmitter);

  /**
   * Start parse json string
   * @function
   * @memberof JSONKey.prototype
   * @param {String} jsonString
   */
  JSONKey.prototype.parse = function(jsonString) {
    var self = this;
    setTimeout(function() {
      self.emit(JSONKEY_TIMEOUT_KEY);
    }, self.timeout);
    try {
      var obj = JSON.parse(jsonString);
      if (util.isArray(obj)) {
        this.crawlArray(obj, "");
      } else {
        this.crawl(obj, "");
      }
    } catch (err) {
      /*noop*/
    }
  };

  /**
   * Create promise which will be resolved when specified key was found in parsed json.
   * @function
   * @memberof JSONKey.prototype
   * @param {String} k key for search
   * @return {Promise} promise
   */
  JSONKey.prototype.key = function(k) {
    var self = this;
    if (typeof k !== "string") throw new Error("key must be String!");
    var p = new P(function(resolve, reject) {
      self.on(k, function(v) {
        resolve(v);
      });
      self.on(JSONKEY_TIMEOUT_KEY, function() {
        reject(null);
      });
    });
    return chainable(p);
  };

  JSONKey.prototype.crawl = function(target, prefix) {
    var self = this;
    nextTick(function() {
      Object.keys(target).forEach(function(key) {
        var val = target[key];
        self.emit(prefix + key, val);
        if (util.isArray(val)) {
          self.crawlArray(val, prefix + key);
        } else if (isObject(val)) {
          self.crawl(val, prefix + key + ".");
        }
      });
    });
  };

  JSONKey.prototype.crawlArray = function(target, prefix) {
    var self = this;
    nextTick(function() {
      target.forEach(function(val, idx) {
        self.emit(prefix + "[" + idx + "]", val);
        if (util.isArray(val)) {
          self.crawlArray(val, prefix + "[" + idx + "]");
        } else if (isObject(val)) {
          self.crawl(val, prefix + "[" + idx + "].");
        }
      });
    });
  };
  module.exports = JSONKey;
})();