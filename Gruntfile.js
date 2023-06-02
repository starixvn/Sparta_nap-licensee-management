/// <binding ProjectOpened='watch' />
module.exports = function (grunt) {
    "use strict";

    var configs = grunt.file.readJSON('grunt.json');
    var webpackDevelopment = require('./Fanex.NAP.Licensee/www/.webpack/build/webpack.dev.conf.js');
    var webpackProduction = require('./Fanex.NAP.Licensee/www/.webpack/build/webpack.pro.conf.js');

    function buildCss(grunt, srcFiles, destPath) {
        srcFiles.forEach(function (file) {
            if (!grunt.file.exists(file)) {
                console.log(file);
            }
        });

        grunt.config.set('concat', {
            dist: {
                src: srcFiles,
                dest: destPath
            }
        });

        grunt.config.set('cssmin', {
            options: {
                sourceMap: false,
                cleancss: true
            },
            all: {
                expand: true,
                src: destPath,
                ext: ".min.css",
                extDot: "last"
            }
        });
    }

    function buildJs(grunt, srcFiles, destPath) {
        srcFiles.forEach(function (file) {
            if (!grunt.file.exists(file)) {
                console.log(file);
            }
        });

        grunt.config.set('concat', {
            dist: {
                src: srcFiles,
                dest: destPath
            }
        });

        grunt.config.set('uglify', {
            options: {
                compress: true,
                sourceMap: true
            },
            files: {
                expand: true,
                src: [destPath],
                ext: ".min.js",
                extDot: "last"
            }
        });
    }

    grunt.file.defaultEncoding = "utf-8";
    grunt.file.preserveBOM = true;

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
                src: configs.cssFilters.slice(2)
            },
        },
        less: {
            options: {
                compress: false,
                sourceMap: false,
                modifyVars: {
                    imgPath: 'images',
                    bgColor: 'red'
                }
            },
            all: {
                expand: true,
                src: configs.lessFilters,
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
                src: configs.cssFilters,
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
                src: configs.jsFilters,
                ext: ".min.js",
                extDot: "last"
            }
        },
        jshint: {
            options: grunt.file.readJSON('jshint.json'),
            beforeconcat: configs.jsFilters,
            afterconcat: ['dist/output.js']
        },
        watch: {
            options: {
                spawn: false,
                nospawn: true,
                event: ['all']
            },
            jshint: {
                files: configs.jsFilters,
                tasks: ['jshint:all']
            },
            less: {
                files: configs.lessFilters,
                tasks: ['less:all']
            },
            csslint: {
                files: configs.cssFilters,
                tasks: ['csslint:all']
            }
        },
        webpack: {
            dev: webpackDevelopment,
            pro: webpackProduction,
        }
    });

    grunt.event.on('watch', function (action, filepath) {
        grunt.config('jshint.all.src', filepath);
        grunt.config('csslint.all.src', filepath);
        grunt.config('less.all.src', filepath);
    });

    grunt.registerTask("jsCore", "", function () {
        buildJs(grunt, configs.jsCore, "Fanex.NAP.Licensee/Scripts/build/core.js");
    });

    grunt.registerTask("cssCore", "", function () {
        buildCss(grunt, configs.cssCore, "Fanex.NAP.Licensee/Content/build/core.css");
    });

    grunt.registerTask("jsLogin", "", function () {
        buildJs(grunt, configs.jsLogin, "Fanex.NAP.Licensee/Scripts/build/login.js");
    });

    grunt.registerTask("jsAngular", "", function () {
        buildJs(grunt, configs.jsAngular, "Fanex.NAP.Licensee/Scripts/build/angular.js");
    });

    grunt.registerTask("jsRecheckIn", "", function () {
        buildJs(grunt, configs.jsRecheckIn, "Fanex.NAP.Licensee/Scripts/build/recheckin.js");
    });

    grunt.registerTask("jsFanexGrid", "", function () {
        buildJs(grunt, configs.jsFanexGrid, "Fanex.NAP.Licensee/Scripts/build/fanexgrid.js");
    });

    grunt.registerTask("cssFanexGrid", "", function () {
        buildCss(grunt, configs.cssFanexGrid, "Fanex.NAP.Licensee/Content/build/fanexgrid.css");
    });

    grunt.registerTask("jsDefaultBetSetting", "", function () {
        buildJs(grunt, configs.jsDefaultBetSetting, "Fanex.NAP.Licensee/Scripts/build/defaultbetsetting.js");
    });

    grunt.registerTask("cssDefaultBetSetting", "", function () {
        buildCss(grunt, configs.cssDefaultBetSetting, "Fanex.NAP.Licensee/Content/build/defaultbetsetting.css");
    });

    grunt.registerTask("jsLicenseeBetSetting", "", function () {
        buildJs(grunt, configs.jsLicenseeBetSetting, "Fanex.NAP.Licensee/Scripts/build/licenseebetsetting.js");
    });

    grunt.registerTask("jsLogSetting", "", function () {
        buildJs(grunt, configs.jsLogSetting, "Fanex.NAP.Licensee/Scripts/build/logSetting.js");
    });

    grunt.registerTask("cssLicenseeBetSetting", "", function () {
        buildCss(grunt, configs.cssLicenseeBetSetting, "Fanex.NAP.Licensee/Content/build/licenseebetsetting.css");
    });

    grunt.registerTask("cssLogSetting", "", function () {
        buildCss(grunt, configs.cssLogSetting, "Fanex.NAP.Licensee/Content/build/log.css");
    });

    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-webpack');

    // Default task(s).
    grunt.registerTask("default", ["watch"]);
    //grunt.registerTask("all", ["uglify", "less", "cssmin"]);
    grunt.registerTask("buildjscore", ["jsCore", "concat", "uglify"]);
    grunt.registerTask("buildcsscore", ["cssCore", "concat", "cssmin"]);
    grunt.registerTask("buildjslogin", ["jsLogin", "concat", "uglify"]);
    grunt.registerTask("buildjsangular", ["jsAngular", "concat", "uglify"]);
    grunt.registerTask("buildjsrecheckin", ["jsRecheckIn", "concat", "uglify"]);
    grunt.registerTask("buildjsfanexgrid", ["jsFanexGrid", "concat", "uglify"]);
    grunt.registerTask("buildcssfanexgrid", ["cssFanexGrid", "concat", "cssmin"]);
    grunt.registerTask("buildjsdefaultbetsetting", ["jsDefaultBetSetting", "concat", "uglify"]);
    //grunt.registerTask("buildcssbetsetting", ["cssBetSetting", "concat", "cssmin"]);
    grunt.registerTask("buildjslicenseebetsetting", ["jsLicenseeBetSetting", "concat", "uglify"]);
    grunt.registerTask("buildjslogsetting", ["jsLogSetting", "concat", "uglify"]);
    grunt.registerTask("buildcsslicenseebetsetting", ["cssLicenseeBetSetting", "concat", "cssmin"]);
    grunt.registerTask("buildcsslogsetting", ["cssLogSetting", "concat", "cssmin"]);

    grunt.registerTask("build", [
        "buildjscore",
        "buildcsscore",
        "buildjslogin",
        "buildjsangular",
        "buildjsrecheckin",
        "buildjsfanexgrid",
        "buildcssfanexgrid",
        "buildjsdefaultbetsetting",
        "buildjslicenseesetting",
        "buildcsslicenseesetting",
        "buildjslogsetting",
        "buildcsslogsetting",
        "buildjslogsetting"]);

    grunt.registerTask("build-react-dev", ['webpack:dev']);
    grunt.registerTask("build-react-pro", ['webpack:pro']);
    grunt.registerTask("build-react-both", ['webpack:dev', 'webpack:pro']);
};