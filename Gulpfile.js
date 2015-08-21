var gulp      = require('gulp');
var jshint    = require('gulp-jshint');
var jscs      = require('gulp-jscs');
var jasmine   = require('gulp-jasmine');
var istanbul  = require('gulp-istanbul');

var paths = {
  'spec' : 'spec/**/*.js',
  'lib'  : 'lib/**/*.js'
}

// Proofread the code
gulp.task('lint', function() {
  return gulp.src([paths.lib, paths.spec])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

// Run the unit tests without any coverage calculations
gulp.task('test', function() {
  return gulp.src([paths.spec])
      .pipe(jasmine());
});

// Task that calculates the unit test coverage for the module
gulp.task('coverage', function() {
  return gulp.src(paths.lib)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      gulp.src([paths.spec])
        .pipe(jasmine())
        .pipe(istanbul.writeReports({
          dir: 'build/coverage',
          reportOpts: {dir: 'build/coverage'}
        }));
    });
});

gulp.task('style', function() {
  return gulp.src(paths.lib)
    .pipe(jscs());
});

gulp.task('default', ['lint', 'style', 'test']);

// alias watch === dev
gulp.task('watch', ['dev']);

// On change to JavaScript files, run lint & test tasks
// Do NOT run default: the style task breaks dev
gulp.task('dev', ['lint', 'test'], function() {
  gulp.watch([paths.spec, paths.lib], ['lint', 'test']);
});

gulp.task('ci', ['default']);
