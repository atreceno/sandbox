'use strict';

var no01 = require('../lib/no01.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['isPalindrome'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'isPalindromeA': function(test) {
    test.expect(3);
    // tests here
    test.equal(no01.isPalindromeA(123321), true, 'number is palindrome.');
    test.equal(no01.isPalindromeA(12321), true, 'number is palindrome.');
    test.equal(no01.isPalindromeA(12345), false, 'number is not palindrome.');
    test.done();
  },
  'isPalindromeB': function(test) {
    test.expect(6);
    // tests here
    test.equal(no01.isPalindromeB(123321), true, 'number is palindrome.');
    test.equal(no01.isPalindromeB(12321), true, 'number is palindrome.');
    test.equal(no01.isPalindromeB(12345), false, 'number is not palindrome.');
    test.equal(no01.isPalindromeB('asdffdsa'), true, 'text is palindrome.');
    test.equal(no01.isPalindromeB('asdsa'), true, 'text is palindrome.');
    test.equal(no01.isPalindromeB('house'), false, 'text is not palindrome.');
    test.done();
  }
};
