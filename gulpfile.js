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
var browserSync = require('browser-sync').create();              // inject code to all devices
var autoprefixer = require('gulp-autoprefixer');        // sets missing browserprefixes


/*******************************************************************************
2. FILE DESTINATIONS (RELATIVE TO ASSSETS FOLDER)
*******************************************************************************/

var target = {
    sass_src : 'css/scss/**/*.scss',                        // all sass files
    css_dest : 'css',                                // where to put minified css
    css_output : 'css/*.css',                                // where to put minified css
    sass_folder : 'css/scss',                                // where to put minified css
    js_lint_src : [                                     // all js that should be linted
        'src/events.js',
        'src/store.js',
        'src/winner.js',
        'src/index.js'
    ],
    js_uglify_src : [                                   // all js files that should not be concatinated
        'src/events.js',
        'src/store.js',
        'src/winner.js',
        'src/index.js'
    ],
    js_concat_src : [                                   // all js files that should be concatinated
        'src/events.js',
        'src/store.js',
        'src/winner.js',
        'src/index.js'
    ],
    js_dest : 'build',                                  // where to put minified js
    css_img : 'css/i'
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
    gulp.src(target.js_lint_src)                        // get the files
        .pipe(jshint())                                 // lint the files
        .pipe(jshint.reporter(stylish))                 // present the results in a beautiful way
});

// concat files
gulp.task('js-concat', function() {
    gulp.src(target.js_concat_src)
        .pipe(concat('index.min.js'))
        .pipe(gulp.dest(target.js_dest));
});

/*******************************************************************************
5. BROWSER SYNC
*******************************************************************************/

gulp.task('browser-sync', function() {
    browserSync.init({
        server: './'
    });
});

/*******************************************************************************
1. GULP TASKS
*******************************************************************************/
gulp.task('watch', function() {
    gulp.watch(target.sass_src, ['compass']).on('change', browserSync.reload);
    gulp.watch(target.css_output).on('change', browserSync.reload);
    gulp.watch(target.js_lint_src, ['js-lint']).on('change', browserSync.reload);
    gulp.watch(target.js_uglify_src, ['js-concat']).on('change', browserSync.reload);
});

gulp.task('default', ['compass', 'js-lint', 'js-concat', 'browser-sync', 'watch']);
