#!/usr/bin/env node
'use strict';

var program = require('commander');
var prompt = require('prompt');
var fs = require('fs');

prompt.message = 'Who would you like to say hello to ?';

program
  .version('0.0.1')
  //.option('-p, --pOption', 'Describe pOption here')
  .parse(process.argv);

// When there are zero args, output help menu
//if (process.argv.length === 2) {
//    program.help();
//}

prompt.start();

prompt.get(['thing'], function(err, result) {
  console.log('Hello ' + result.thing + ' !\n');

  fs.writeFile('hello.txt', 'Hello ' + result.thing + '!', function(err) {
    if (err) { return console.log(err); }
    console.log('Hello World > hello.txt');
  });
});

