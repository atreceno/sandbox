/*
 * It returns true when number is palindrome, otherwise returns false.
 */

(function(exports) {
  'use scrict';
  exports.isPalindromeA = function (n) {
    if (isNaN(n)) {
      return false;
    }
    var p = 0;
    var m = n;
    while (m!==0) {
      p = p*10 + m%10;
      m = m/10 >> 0;
    }
    return (n===p);
  };
  exports.isPalindromeB = function (s) {
    if (typeof(s) !== 'string') { 
        s = s.toString();
    }
    return (s === s.split('').reverse().join(''));
  };
}(typeof exports === 'object' && exports || this));
