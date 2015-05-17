/**
 * Created by fima on 15.05.15.
 */

var gulp = require('gulp');

var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var gulpClosureCSSRenamer = require('gulp-closure-css-renamer');
var del = require('del');
var soynode = require('gulp-soynode');
var closureCompiler = require('gulp-closure-compiler');

gulp.task('clean', function() {
  del(['tmp/*', 'target/*'], function(err, deletedFiles) {
    console.log('Files deleted:', deletedFiles.join(', '));
  });
});

gulp.task('less', function() {
  return gulp.src('./src/less/main.less')
    .pipe(less())
    .pipe(gulpClosureCSSRenamer({
      //sourceMap: true,
      compress: true,
      renameFile: './tmp/rename.js'
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./target/'));
});

gulp.task('soy', function() {
  var soyCompiler = soynode({
    eraseTemporaryFiles: true,
    useClosureStyle: true,
    loadCompiledTemplates: false,
    cssHandlingScheme: 'goog'
  });
  return gulp.src('./src/soy/**/*.soy')
    .pipe(soyCompiler)
    .pipe(gulp.dest('./tmp/soy'));
});

gulp.task('closure', ['less', 'soy'], function() {
  gulp.src([
    './src/js/**/*.js',
    './tmp/**/*.js',
    './bower_components/closure-library/closure/goog/**/*.js',
    './bower_components/closure-templates/javascript/soyutils_usegoog.js'
  ])
    .pipe(closureCompiler({
      compilerPath: './bower_components/compiler-latest/compiler.jar',
      fileName: 'main.js',
      compilerFlags: {
        closure_entry_point: 'app.main',
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        define: [
          "goog.DEBUG=false"
        ],
        only_closure_dependencies: true,
        warning_level: 'QUIET'
      }
    }))
    .pipe(gulp.dest('./target'));
});

gulp.task('copy', function() {
  gulp.src('./src/static/**/*')
    .pipe(gulp.dest('./target'));
});

//gulp.task('watch', ['scripts'], function() {
//  gulp.watch('lib/*.ts', ['scripts']);
//});

gulp.task('default', ['copy', 'less', 'soy', 'closure']);