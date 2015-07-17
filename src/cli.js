#!/usr/bin/env node
(function() {
  'use strict';

  var program = require('commander');
  var prompt = require('prompt');
  var mustache = require('mustache');
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

    fs.readFile(__dirname + '/templates/template.mustache', 'utf8', function(err, template) {
      if (err) {
        return console.log(err);
      }

      var view = {
        stuff: result.thing
      };

      var output = mustache.render(template, view);

      fs.writeFile('hello.txt', output, function(err) {
        if (err) {
          return console.log(err);
        }
      });
    });
  });
}());
