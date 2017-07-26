"use strict";

var gulp   = require("gulp");
var util   = require("gulp-util");
var data   = require("gulp-data");
var noop   = require("gulp-noop");
var rename = require("gulp-rename");
var header = require("gulp-header");
var jshint = require("gulp-jshint");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat-util");
var pkg    = require("./package.json");
var nl     = require("os").EOL;
/*
** CONFIG & PATHS
*/
var config = {
    header  : "/*! jQuery <%= info %> - MIT&GPL-2.0 license - Copyright 2012-<%= year %> <%= pkg.author.name %> */",
    main    : pkg.main
};
/*
** PIPES
*/
var pipes  = {};

// check files with jshint
pipes.validateFiles = function(files) {
    return gulp.src(files, {base: "./"})
        .pipe(jshint())
        .pipe(jshint.reporter("jshint-stylish"));
};
// check all files
pipes.validate = function() {
    return pipes.validateFiles([config.main]);
};
// build main project file
pipes.buildMain = function() {
    return pipes.validateFiles(config.main)
        .pipe(uglify())
        .pipe(header(config.header + nl, {
            pkg  : pkg,
            info : "v" + pkg.version,
            year : new Date().getFullYear()
        }))
        .pipe(rename(function(path) {
            path.extname = ".min" + path.extname;
        }))
        .pipe(gulp.dest("./"));
};
/*
** TASKS
*/
// check & build everything
gulp.task("build", ["build-main"]);

// check & build main project file
gulp.task("build-main", pipes.buildMain);

// check all files
gulp.task("validate", pipes.validate);

// check, build & watch live changes
gulp.task("watch", ["build"], function() {
    // watch main file
    gulp.watch(config.main, function() {
        var task = pipes.buildMain();
        util.log("updated", "'" + util.colors.red("main file") + "'");
        return task;
    });
});