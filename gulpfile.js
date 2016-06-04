/*******************************************************************************
1. DEPENDENCIES
*******************************************************************************/

var gulp = require('gulp');                             // gulp core
var compass = require('gulp-compass');                  // compass compiler
var uglify = require('gulp-uglify');                    // uglifies the js
var jshint = require('gulp-jshint');                    // check if js is ok
var rename = require("gulp-rename");                    // rename files
var concat = require('gulp-concat');                    // concatinate js
var notify = require('gulp-notify');                    // send notifications to osx
var plumber = require('gulp-plumber');                  // disable interuption
var stylish = require('jshint-stylish');                // make errors look good in shell
var minifycss = require('gulp-minify-css');             // minify the css files
var browserSync = require('browser-sync').create();     // inject code to all devices
var autoprefixer = require('gulp-autoprefixer');        // sets missing browserprefixes
var nodemon = require('gulp-nodemon');
var webpack = require('webpack-stream');
var port = process.env.PORT || 3000;

/*******************************************************************************
2. FILE DESTINATIONS (RELATIVE TO ASSSETS FOLDER)
*******************************************************************************/

var target = {
    sass_src : 'css/scss/**/*.scss',                        // all sass files
    css_dest : 'public/css',                                // where to put minified css
    css_output : 'public/css/*.css',                                // where to put minified css
    sass_folder : 'css/scss',                                // where to put minified css
    js_concat_src : [                                   // all js files that should be concatinated
        'src/utils.js',
        'src/store.js',
        'src/winner-service.js',
        'src/score-view.js',
        'src/grid-view.js',
        'src/fiveicon-view.js',
        'src/game.js',
        'src/initializer.js'
    ],
    js_dest : 'public/js',                                  // where to put minified js
    css_img : 'public/css/i'
};


/*******************************************************************************
3. COMPASS TASK
*******************************************************************************/

gulp.task('compass', function() {
    gulp.src(target.sass_src)
        .pipe(plumber())
        .pipe(compass({
            css: target.css_dest,
            sass: target.sass_folder,
            image: target.css_img
        }))
        .pipe(autoprefixer(
            'last 2 version',
            '> 1%',
            'ios 6',
            'android 4'
        ))
        .pipe(minifycss())
        .pipe(gulp.dest(target.css_dest));
});


/*******************************************************************************
4. JS TASKS
*******************************************************************************/

// lint my custom js
gulp.task('js-lint', function() {
    gulp.src(target.js_concat_src)                        // get the files
        .pipe(jshint())                                 // lint the files
        .pipe(jshint.reporter(stylish))                 // present the results in a beautiful way
});

/*******************************************************************************
5. BROWSER SYNC
*******************************************************************************/
gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: 'http://localhost:' + port,
        files: ['public/**/*.*'],
        port: 5000
    });
});

// Reference: https://gist.github.com/sogko/b53d33d4f3b40d3b4b2e
gulp.task('nodemon', function(cb) {
    return nodemon({
      script: 'index.js'
    }).once('start', cb);
});

gulp.task('webpack', function() {
  return gulp.src(target.js_concat_src)
    .pipe(webpack({ output: { filename: 'app.js' }}))
    .pipe(gulp.dest(target.js_dest));
});

/*******************************************************************************
1. GULP TASKS
*******************************************************************************/
// gulp.task('watch', function() {
//     gulp.watch(target.sass_src, ['compass']).on('change', browserSync.reload);
//     gulp.watch(target.css_output).on('change', browserSync.reload);
//     gulp.watch(target.js_concat_src, ['js-lint']).on('change', browserSync.reload);
//     gulp.watch(target.js_concat_src, ['webpack']).on('change', browserSync.reload);
// });

gulp.task('default', ['compass', 'js-lint', 'webpack', 'nodemon']);
