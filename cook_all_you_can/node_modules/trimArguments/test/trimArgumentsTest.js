"use strict";

var Unit = require('deadunit')
var trim = require('../trimArguments')

Unit.test("Testing trimArguments", function(t) {

    function test() {
        return trim(arguments)
    }

    var emptyTest = test()
    this.ok(emptyTest.length === 0)

    var arrayTest = test(1,2,3)
    this.ok(arrayTest.length === 3)
    this.ok(arrayTest instanceof Array)

    var n = 0
    arrayTest.forEach(function(v) {
        n++
        t.ok(v===n)
    })

    var undefinedTest = test(undefined, 1, 2, 3, undefined)
    this.ok(undefinedTest.length === 4, undefinedTest.length)
    this.ok(undefinedTest[0] === undefined, undefinedTest[0])
    this.ok(undefinedTest[1] === 1, undefinedTest[1])
    this.ok(undefinedTest[2] === 2, undefinedTest[2])
    this.ok(undefinedTest[3] === 3, undefinedTest[3])
    this.ok(undefinedTest[4] === undefined, undefinedTest[4])

}).writeConsole()

