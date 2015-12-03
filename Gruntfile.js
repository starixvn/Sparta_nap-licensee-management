/// <vs Clean='all' />
module.exports = function (grunt) {
"use strict";

    var jsFilters = [
        "Fanex.NAP.Licensee/Areas/**/*.js",
        "Fanex.NAP.Licensee/Scripts/**/*.js",
        "!*.min.js",
        "!**/*.min.js",
        "!**/*-vsdoc.js",
        "!**/npm.js"
    ];

    var lessFilters = [
        "Fanex.NAP.Licensee/Content/**/*.less",
        "!Fanex.NAP.Licensee/Content/bootstrap/*.less",
        "!Fanex.NAP.Licensee/Content/bootstrap/**/*.less",
        "!Fanex.NAP.Licensee/Content/core/common.less",
        "!**/variables.less",
        "!**/mixins.less",
        "Fanex.NAP.Licensee/Content/bootstrap/bootstrap.less",
    ];

    var cssFilters = [
        "Fanex.NAP.Licensee/Content/**/*.css",
        "Fanex.NAP.Licensee/Areas/**/*.css",
        "!*.min.css",
        "!**/*.min.css"
    ];

    grunt.file.defaultEncoding = "utf-8";
    grunt.file.preserveBOM = true;

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        csslint: {
            options: {
                csslintrc: "csslintrc.json"
            },
            dev: {
                options: {
                    // import: 2
                },
                src: cssFilters.slice(2)
            },
        },
        less: {
            options: {
                compress: false,
                sourceMap: false
            },
            all: {
                expand: true,
                src: lessFilters,
                ext: ".css",
                extDot: "last"
            }
        },
        cssmin: {
            options: {
                sourceMap: false
            },
            all: {
                expand: true,
                src: cssFilters,
                ext: ".min.css",
                extDot: "last"
            }
        },
        uglify: {
            options: {
                compress: true,
                sourceMap: true
            },
            all: {
                expand: true,
                src: jsFilters,
                ext: ".min.js",
                extDot: "last"
            }
        },
        watch: {
            options: {
                spawn: false,
                nospawn: true,
                event: ['all']
            },
            js: {
                files: jsFilters,
                tasks: ['uglify:all']
            },
            less: {
                files: lessFilters,
                tasks: ['less:all']
            },
            css: {
                files: cssFilters,
                tasks: ['cssmin:all']
            }
        }
    });

    grunt.event.on('watch', function (action, filepath) {
        grunt.config('less.all.src', filepath);
        grunt.config('cssmin.all.src', filepath);
        grunt.config('uglify.all.src', filepath);
    });

    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-contrib-csslint');

    // Default task(s).
    grunt.registerTask("default", ["watch"]);
    grunt.registerTask("all", ["uglify", "less", "cssmin"]);
};