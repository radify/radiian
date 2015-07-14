#!/usr/bin/env node

var program = require('commander');
var prompt = require('prompt');

prompt.message = 'Who would you like to say hello to ?';
prompt.delimiter = '><'.green;

program
    .version('0.0.1')
    //.option('-p, --peppers', 'Add peppers')
    //.option('-P, --pineapple', 'Add pineapple')
    //.option('-b, --bbq-sauce', 'Add bbq sauce')
    //.option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
    .parse(process.argv);

// When there are zero args, output help menu
//if (process.argv.length === 2) {
//    program.help();
//}

//var argument = process.argv[2];

//console.log('You entered argument: ' + argument + '\n');

//console.log('Who would you like to say hello to ?\n');

prompt.start();

prompt.get(['thing'], function(err, result) {
    console.log('Hello ' + result.thing + ' !\n');
});

