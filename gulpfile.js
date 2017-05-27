/**
 * Created by Gemu on 2017/5/26.
 */
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const $ = require('gulp-load-plugins')();

gulp.task('build-js', function () {
    return gulp.src([
        'app/**/*.js'
    ]).pipe(uglify()).pipe(gulp.dest('dist/app'));
});
gulp.task('build-root-js', function () {
    return gulp.src([
        '*.js'
    ]).pipe(uglify()).pipe(gulp.dest('dist'));
});

gulp.task('build-css', function () {
    return gulp.src([
        'app/assets/styles/*.css'
    ]).pipe($.minifyCss()).pipe(gulp.dest('dist/appt'));
});

gulp.task('build-root-css', function () {
    return gulp.src([
        '*.css'
    ]).pipe($.minifyCss()).pipe(gulp.dest('dist'));
});

gulp.task('build-html', function () {
    return gulp.src([
        'app/**/*.html',
    ]).pipe(gulp.dest('dist/app'));
});

gulp.task('build-root-html', function () {
    return gulp.src([
        '*.html'
    ]).pipe(gulp.dest('dist'));
});

gulp.task('build-module-other', function () {
    return gulp.src([
        //'node_modules/@angular/**',
        //'node_modules/angular2-in-memory-web-api/**',
        //'node_modules/bootstrap/**',
        //'node_modules/core-js/**',
        //'node_modules/font-awesome/**',
        //'node_modules/http-proxy/**',
        //'node_modules/phantom/**',
        //'node_modules/reflect-metadata/**',
        //'node_modules/rxjs/**',
        //'node_modules/systemjs/**',
        //'node_modules/zone.js/**',
        //'node_modules/phantom/**',
        //'node_modules/concurrently/**',
        //'node_modules/lite-server/**',
        //'node_modules/typescript/**',
        //'node_modules/typings/**',
        //'node_modules/core-js/**',
        //'node_modules/core-js/**'
        'node_modules/**/*',
        '!node_modules/**/*.css'
    ], {base: 'node_modules'}).pipe(gulp.dest('dist' + '/node_modules'));
});

gulp.task('build-module-css', function () {
    return gulp.src([
        'node_modules/**/*.css'
    ], {base: 'node_modules'}).pipe($.minifyCss()).pipe(gulp.dest('dist' + '/node_modules'));
});

gulp.task('build-other', function () {
    return gulp.src([
        'app/**',
        '!app/**/*.js',
        '!app/**/*.ts',
        '!app/**/*.html',
        '!app/*.html'
    ]).pipe(gulp.dest('dist/app'));
});

gulp.task('build-package', function () {
    return gulp.src(['package.json'])
        .pipe(gulp.dest('dist'));
});

gulp.task('build', [
    'build-js',
    'build-root-js',
    'build-css',
    'build-root-css',
    'build-other',
    'build-html',
    'build-root-html',
    'build-module-css',
    'build-module-other',
    'build-package'
]);
