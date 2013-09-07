#!/usr/bin/env node

var prime_numbers = function prime_numbers(n) {
  var prime_tuple = [], i = 2;

  while (prime_tuple.length < 100) {
    if (is_prime(i)) { prime_tuple.push(i); }
    ++i;
  }

  return prime_tuple;
}

var is_prime = function is_prime(n) {
  if (n < 2) { return false; }

  var prime_regex = /^1?$|^(11+?)\1+$/, str_n = '';
  for(var i = 0; i < n; i++) { str_n += '1'; }

  return !str_n.match(prime_regex);
}

var write_to_file = function write_to_file(out) {
  var fs = require('fs');
  var outfile = "prime.txt";
  fs.writeFileSync(outfile, out);
}

var out = prime_numbers().join(',');
write_to_file(out);

console.log("Script: " + __filename);
