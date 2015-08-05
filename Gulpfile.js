var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var jasmine = require('gulp-jasmine');
var istanbul = require('gulp-istanbul');

// Proofread the code
gulp.task('lint', function() {
  return gulp.src(['lib/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

// Run the unit tests without any coverage calculations
gulp.task('test', function() {
  return gulp.src(['spec/**/*.js'])
      .pipe(jasmine());
});

// Task that calculates the unit test coverage for the module
gulp.task('coverage', function() {
  return gulp.src('lib/**/*.js')
      .pipe(istanbul())
      .pipe(istanbul.hookRequire())
      .on('finish', function() {
        gulp.src(['spec/**/*.js'])
            .pipe(jasmine())
            .pipe(istanbul.writeReports({
              dir: 'build/coverage',
              reportOpts: {dir: 'build/coverage'}
            }));
      });
});

gulp.task('style', function() {
  return gulp.src('lib/**/*.js')
    .pipe(jscs());
});

gulp.task('default', ['lint', 'style', 'test']);

// On change to JavaScript files, run the default task
gulp.task('dev', ['default'], function() {
  gulp.watch(['spec/**/*.js', 'lib/**/*.js'], ['default']);
});
