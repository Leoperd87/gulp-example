/**
 * Created by fima on 15.05.15.
 */

var gulp = require('gulp');

var less = require('gulp-less');
var path = require('path');
var minifyCSS = require('gulp-minify-css');
var del = require('del');
var soynode = require('gulp-soynode');
var ts = require('gulp-typescript');
var merge = require('merge2');

var tsProject = ts.createProject({
  declarationFiles: true,
  noExternalResolve: true
});

var exec = require('child_process').exec,
  child;

gulp.task('clean', function() {

  del(['tmp/*', 'target/*'], function(err, deletedFiles) {
    console.log('Files deleted:', deletedFiles.join(', '));
  });
});

gulp.task('less', function() {

  gulp.src('./src/less/main.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest('./tmp/'));
});

gulp.task('gss', function() {
  child = exec(
    (['java -jar ./resources/closure-stylesheets-20111230.jar',
      '--output-file ./target/main.css',
      '--output-renaming-map-format CLOSURE_COMPILED',
      '--rename CLOSURE',
      '--output-renaming-map ./tmp/renaming_map.js',
      '--allow-unrecognized-functions',
      '--allow-unrecognized-properties',
      './tmp/main.css']).join(' '),
    function(error, stdout, stderr) {
      if (stdout !== null && stdout.length) {
        console.log('stdout: ' + stdout);
      }
      if (stderr !== null && stderr.length) {
        console.log('stderr: ' + stderr);
      }
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
});


gulp.task('soy', function() {
  gulp.src('./src/soy/**/*.soy')
    .pipe(soynode({
      eraseTemporaryFiles: true
    }))
    .pipe(gulp.dest('./tmp/soy'));
});

gulp.task('typescript', function() {
  var tsResult = gulp.src(['./src/ts/**/*.ts', './resources/closure-library.d.ts/**/*.ts'])
    .pipe(ts(tsProject));

  return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done.
    tsResult.dts.pipe(gulp.dest('./resources/definitions')),
    tsResult.js.pipe(gulp.dest('./tmp/js'))
  ]);
});
//gulp.task('watch', ['scripts'], function() {
//  gulp.watch('lib/*.ts', ['scripts']);
//});

gulp.task('default', ['clean', 'less', 'gss', 'soy', 'typescript']);