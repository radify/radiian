(function() {
  'use strict';

  var inquirer = require('inquirer');
  var generator = require('./Generator');
  var questions = require('./questions');

  function clear() {
    process.stdout.write('\u001b[2J\u001b[0;0H');
  }

  function go(questions, success) {
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
          // load existing answers as defaults into questions so user is modifying,
          // not starting from scratch
          questions.map(function(question) {
            question.default = answers[question.name];
          });
          go(questions, success);
        } else {
          success(answers);
        }
      });
    });
  }

  go(questions, function(answers) {
    console.log('Generating playbook for an app named ' + answers.appName + ' in ./ansible...');
    generator.generate(answers);

    console.log('... done! Check out ./ansible for your playbook.');
    console.log('Please make sure that you update ansible/' + answers.appPem);
  });

}());
