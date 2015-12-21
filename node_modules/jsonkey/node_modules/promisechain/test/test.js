// For command line test
if (typeof module !== "undefined" && module.exports) {
  /*jshint -W079 */
  var chai = require("chai");
  var expect = chai.expect;
  var chaiAsPromised = require("chai-as-promised");
  var Promise = require("es6-promise").Promise;
  chai.use(chaiAsPromised);
  var PromiseChain = require("../index.js");
  /*jshint +W079 */
  this.PromiseChain = PromiseChain;
}
(function(global) {
  "use strict";
  var chainable = global.PromiseChain.chainable;

  function willBeFail(val) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(val);
      }, 10);
    });
  }

  function willBeSuccess(val) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(val);
      }, 10);
    });
  }

  function expectHavingChainableMethods(p, title) {
    ["filter",
    "pipe",
    "recovery",
    "map",
    "reduce",
    "first",
    "head",
    "take",
    "first",
    "initial",
    "last",
    "rest",
    "tail",
    "drop",
    "keys",
    "values",
    "pairs"].forEach(function(method) {
      it(title + " will have chainable method: " + method, function() {
        expect(typeof p[method]).to.be.equal("function");
      });
    });
  }

  describe("Test for promisechain: ", function() {
    context("Given success promise", function() {
      var p = willBeSuccess(1);
      chainable(p);
      expectHavingChainableMethods(p, "");
    });
    context("Given fail promise", function() {
      var p = willBeFail();
      chainable(p);
      expectHavingChainableMethods(p, "");
    });

    describe("Test for filter method: ", function() {
      function filterSuccessTest(target) {
        var p = willBeSuccess(target.val);
        chainable(p);
        if (target.expected) {
          it("When " + target.val + " is passed to filter, " + target.name + " then pass value to next", function() {
            return expect(p.filter(target.predicate)).to.eventually.be.equal(target.expected);
          });
        } else {
          it("When " + target.val + " is passed to filter, " + target.name + " then reject", function() {
            return expect(p.filter(target.predicate)).to.be.eventually.rejected;
          });
        }
        expectHavingChainableMethods(p, "And it");
      }

      function filterFailTest(target) {
        var p = willBeFail(target.val);
        chainable(p);
        it("When " + target.val + " is passed, " + target.name + " then reject", function() {
          return expect(p.filter(target.predicate)).to.be.eventually.rejected;
        });
        expectHavingChainableMethods(p, "And it");
      }

      var examples = [
        {
          val: 10,
          predicate: 10,
          expected: 10,
          name: "`exactry same value(10) predicate`"
        },
        {
          val: 11,
          predicate: 10,
          expected: null,
          name: "`exactry same value(10) predicate`"
        },
        {
          val: 10,
          predicate: function(v) {
            return v <= 10;
          },
          expected: 10,
          name: "which predicate less than equal 10"
        },
        {
          val: 11,
          predicate: function(v) {
            return v <= 10;
          },
          expected: null,
          name: "which predicate less than equal 10"
        }
      ];

      context("Given success promise", function() {
        examples.forEach(filterSuccessTest);
      });
      context("Given failer promise", function() {
        examples.forEach(filterFailTest);
      });
    });

    describe("Test for pipe method: ", function() {
      function pipeSuccessTest(target) {
        var p = willBeSuccess(target.val);
        chainable(p);

        if (typeof target.pipe === "function") {
          it("When " + target.val + " is passed to pipe, " + target.name + " then pass value to next", function() {
            return expect(p.pipe(target.pipe)).to.eventually.be.equal(target.expected);
          });
        } else {
          it("When " + target.val + " is passed to pipe, " + target.name + " then reject", function() {
            return expect(p.pipe(target.pipe)).to.eventually.rejected;
          });
        }
        expectHavingChainableMethods(p, "And it");
      }

      function pipeFailTest(target) {
        var p = willBeFail(target.val);
        chainable(p);
        it("When " + target.val + " is passed to pipe, " + target.name + " then reject", function() {
          return expect(p.pipe(target.pipe)).to.be.eventually.rejected;
        });
        expectHavingChainableMethods(p, "And it");
      }

      var examples = [
        {
          val: 10,
          pipe: function(v) {
            return v * 2;
          },
          expected: 20,
          name: "which double the value "
        },
        {
          val: "hello world",
          pipe: function(v) {
            return v.toUpperCase();
          },
          expected: "HELLO WORLD",
          name: "which convert the value to uppercase"
        },
        {
          val: 10,
          pipe: "Not a function",
          expected: null,
          name: "which is not a function"
        }
      ];

      context("Given success promise", function() {
        examples.forEach(pipeSuccessTest);
      });
      context("Given failer promise", function() {
        examples.forEach(pipeFailTest);
      });
    });

    describe("Test for recovery method: ", function() {
      function recoverySuccessTest(target) {
        var p = willBeSuccess(target.val);
        chainable(p);
        it("When " + target.val + " is passed to recovery, just pass value to next", function() {
          return expect(p.recovery(target.recovery)).to.eventually.be.equal(target.expected);
        });
        expectHavingChainableMethods(p, "And it");
      }

      function recoveryFailTest(target) {
        var p = willBeFail(target.val);
        chainable(p);
        it("When " + target.val + " is passed to recovery, " + target.name + " then pass value to next", function() {
          return expect(p.recovery(target.recovery)).to.eventually.be.deep.equal(target.expected);
        });
        expectHavingChainableMethods(p, "And it");
      }

      var examples1 = [
        {
          val: 5,
          recovery: 10,
          expected: 5,
          name: "which recover with static value "
        },
        {
          val: 5,
          recovery: function(v) {
            return {
              error: v,
              next: 10
            };
          },
          expected: 5,
          name: "which recover with function evaluation value "
        }
      ];

      var examples2 = [
        {
          val: Error("Some error"),
          recovery: 10,
          expected: 10,
          name: "which recover with static value "
      },
        {
          val: Error("Some error"),
          recovery: function(v) {
            return {
              error: v,
              next: 10
            };
          },
          expected: {
            error: Error("Some error"),
            next: 10
          },
          name: "which recover with function evaluation value "
      }
      ];

      context("Given success promise", function() {
        examples1.forEach(recoverySuccessTest);
      });
      context("Given failer promise", function() {
        examples2.forEach(recoveryFailTest);
      });
    });

    describe("Chain example: pipe_filter_recovery_pipe", function() {
      function test(target) {
        it(target.title, function() {
          var p = willBeSuccess(target.val);
          chainable(p);

          return expect(
            p.pipe(function(v) {
              return v * 2;
            })
            .filter(function(v) {
              return v > 20;
            })
            .recovery(99)
            .pipe(function(v) {
              return v + 1;
            })
          ).to.eventually.be.deep.equal(target.expected);
        });
      }
      context("filter chain reject value and recovery chain recover value", function() {
        test({
          val: 5,
          expected: 100,
          title: "Will be responed with recoverd value"
        });
      });
      context("filter chain reject value and recovery chain recover value", function() {
        test({
          val: 20,
          expected: 41,
          title: "pass filter chain and recovery chain don't work"
        });
      });
    });

    describe("Test for underscore alias methods: ", function() {
      function aliasSuccessTest(target) {
        var p = willBeSuccess(target.val);
        chainable(p);
        context(target.method, function() {
          it("When " + target.val + " is passed to " + target.method + " with " + target.args + ", it will evaluate value as underscore's way, then pass to next", function() {
            return expect(p[target.method].apply(null, target.args)).to.eventually.be.deep.equal(target.expected);
          });
          expectHavingChainableMethods(p, "And it");
        });
      }

      function aliasFailTest(target) {
        var p = willBeFail(target.val);
        chainable(p);
        context(target.method, function() {
          it("When " + target.val + " is passed to " + target.method + " then reject", function() {
            return expect(p[target.method].apply(null, target.args)).to.be.eventually.rejected;
          });
          expectHavingChainableMethods(p, "And it");
        });
      }

      var examples = [
        {
          val: ["something", "array"],
          method: "map",
          args: [
            function(v) {
              return v.toUpperCase();
            }
          ],
          expected: ["SOMETHING", "ARRAY"]
        },
        {
          val: [1, 2, 3],
          method: "reduce",
          args: [
              function(acc, v) {
              return acc + v;
              },
              0
            ],
          expected: 6
        },
        {
          val: [1, 2, 3, 4, 5],
          method: "first",
          args: [],
          expected: 1
        },
        {
          val: [1, 2, 3, 4, 5],
          method: "head",
          args: [2],
          expected: [1, 2]
        },
        {
          val: [1, 2, 3, 4, 5],
          method: "take",
          args: [3],
          expected: [1, 2, 3]
        },
        {
          val: [1, 2, 3, 4, 5],
          method: "initial",
          args: [],
          expected: [1, 2, 3, 4]
        },
        {
          val: [1, 2, 3, 4, 5],
          method: "initial",
          args: [3],
          expected: [1, 2]
        },
        {
          val: [1, 2, 3, 4, 5],
          method: "last",
          args: [],
          expected: 5
        },
        {
          val: [1, 2, 3, 4, 5],
          method: "last",
          args: [2],
          expected: [4, 5]
        },
        {
          val: [1, 2, 3, 4, 5],
          method: "rest",
          args: [],
          expected: [2, 3, 4, 5]
        },
        {
          val: [1, 2, 3, 4, 5],
          method: "tail",
          args: [2],
          expected: [3, 4, 5]
        },
        {
          val: [1, 2, 3, 4, 5],
          method: "drop",
          args: [3],
          expected: [4, 5]
        },
        {
          val: {
            "key1": "val1",
            "key2": "val2"
          },
          method: "keys",
          args: [],
          expected: ["key1", "key2"]
        },
        {
          val: {
            "key1": "val1",
            "key2": "val2"
          },
          method: "values",
          args: [],
          expected: ["val1", "val2"]
        },
        {
          val: {
            "key1": "val1",
            "key2": "val2"
          },
          method: "pairs",
          args: [],
          expected: [["key1", "val1"], ["key2", "val2"]]
        }
      ];
      context("Given success promise", function() {
        examples.forEach(aliasSuccessTest);
      });
      context("Given failer promise", function() {
        examples.forEach(aliasFailTest);
      });
    });
  });

})((typeof module !== "undefined" && module.exports) ? this : typeof window !== "undefined" ? window : this);