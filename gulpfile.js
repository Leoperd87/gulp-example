/**
 * Created by fima on 15.05.15.
 */

var gulp = require('gulp');

var mkdirp = require('mkdirp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var gulpClosureCSSRenamer = require('gulp-closure-css-renamer');
var del = require('del');
var soynode = require('gulp-soynode');
var closureCompiler = require('gulp-closure-compiler');
var gulpif = require('gulp-if');
var sprity = require('sprity');
var jsdoc = require('gulp-jsdoc');
var exec = require('child_process').exec;
var child;

gulp.task('clean', function() {
  del(['tmp', 'target', 'doc'], function(err, deletedFiles) {
    console.log('Files deleted:', deletedFiles.join(', '));
  });
});

gulp.task('copyLess', function() {
  return gulp.src('./src/less/**/*')
    .pipe(gulp.dest('./tmp/less'));
});

gulp.task('less', ['copyLess', 'sprites'], function() {
  return gulp.src('./tmp/less/main.less')
    .pipe(less())
    .pipe(gulpClosureCSSRenamer({
      compress: true,
      renameFile: './tmp/js/rename.js'
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

gulp.task('closure', ['sprites', 'less', 'soy'], function() {
  gulp.src([
    './src/js/**/*.js',
    './tmp/js/**/*.js',
    './tmp/soy/**/*.js',
    './bower_components/closure-library/closure/goog/**/*.js',
    './bower_components/closure-library/third_party/closure/goog/**/*.js',
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
  mkdirp('./tmp/js', function(err) {
  });
  mkdirp('./target', function(err) {
  });
});

//gulp.task('watch', ['scripts'], function() {
//  gulp.watch('lib/*.ts', ['scripts']);
//});

gulp.task('sprites', function() {
  return sprity.src({
    src: './src/sprites/**/*.png',
    cssPath: './images/sprites',
    name: 'man-sprite',
    template: './src/sprites/sprite.hbs',
    style: 'man-sprite.less',
    //processor: 'less',
    orientation: 'binary-tree',
    margin: 0,
    split: true,
    prefix: 'man-icons'
    // ... other optional options
  })
    .pipe(gulpif('*.png', gulp.dest('./target/images/sprites/'), gulp.dest('./tmp/less/sprites')));
});

gulp.task('jsdoc', function() {
  return gulp.src([
    './src/js/**/*.js'
  ])
    .pipe(jsdoc('./doc/js'));
});

gulp.task('prepareStyleDoc', ['copyLess', 'sprites'], function(cb) {
  child = exec('kss-node -c kss-config.json', function(error, stdout, stderr) {
    cb();
  });
});

gulp.task('doc', ['jsdoc', 'prepareStyleDoc'], function() {
  gulp.src('./target/images/**/*')
    .pipe(gulp.dest('./doc/styles/public/images'));

  return gulp.src('./tmp/less/styles.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest('./doc/styles/public/'));
});

gulp.task('default', ['copy', 'closure']);
