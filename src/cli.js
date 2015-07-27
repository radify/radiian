#!/usr/bin/env node
(function() {
  'use strict';

  var program = require('commander');
  var inquirer = require('inquirer');

  var packageInfo = require('../package.json');
  var generator = require('./lib/Generator');
  var questions = require('./lib/questions');

  program
    .version(packageInfo.version)
    .parse(process.argv);

  var userHappy = false;
  var submittedAnswers = null;

  function clear() {
    process.stdout.write("\u001b[2J\u001b[0;0H");
  }

  function go(questions) {
    clear();
    inquirer.prompt(questions, function(answers) {
      inquirer.prompt([{
        type: 'confirm',
        name: 'confirm',
        message: function() {
          clear();
          return 'Please confirm that your answers are correct.\n' +
              JSON.stringify(answers, null, '  ') +
            '\nAre these answers correct?';
        },
        default: true
      }], function(confirmation) {
        if (!confirmation.confirm) {
          console.log(questions);
          console.log(answers);

          // load existing answers as defaults into questions so user is modifying,
          // not starting from scratch
          for (var i = 0; i < questions.length; i++) {
            if (questions[i].default) {
              questions[i].default = answers[questions[i].name];
            }
          }
          go(questions);
        } else {
          submittedAnswers = answers;
          userHappy = true;
        }
      });
    });
  }
  go(questions);

  require('deasync').loopWhile(function(){
    return !userHappy;
  });

  console.log("Generating playbook for an app named " + submittedAnswers.appName + " in ./ansible...");
  generator.generate(submittedAnswers);

  console.log("... done! Check out ./ansible, it's full of creamy goodness");
}());
