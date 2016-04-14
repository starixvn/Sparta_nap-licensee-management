/// <binding ProjectOpened='watch' />
module.exports = function (grunt) {
    "use strict";

    var configs = grunt.file.readJSON('grunt.json');

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

    grunt.registerTask("jsBetSetting", "", function () {
        buildJs(grunt, configs.jsBetSetting, "Fanex.NAP.Licensee/Scripts/build/betsetting.js");
    });

    grunt.registerTask("cssBetSetting", "", function () {
        buildCss(grunt, configs.cssBetSetting, "Fanex.NAP.Licensee/Content/build/betsetting.css");
    });

    grunt.registerTask("jsLicenseeSetting", "", function () {
        buildJs(grunt, configs.jsLicenseeSetting, "Fanex.NAP.Licensee/Scripts/build/licenseesetting.js");
    });

    grunt.registerTask("cssLicenseeSetting", "", function () {
        buildCss(grunt, configs.cssLicenseeSetting, "Fanex.NAP.Licensee/Content/build/licenseesetting.css");
    });

    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');

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
    grunt.registerTask("buildjsbetsetting", ["jsBetSetting", "concat", "uglify"]);
    //grunt.registerTask("buildcssbetsetting", ["cssBetSetting", "concat", "cssmin"]);
    grunt.registerTask("buildjslicenseesetting", ["jsLicenseeSetting", "concat", "uglify"]);
    grunt.registerTask("buildcsslicenseesetting", ["cssLicenseeSetting", "concat", "cssmin"]);

    grunt.registerTask("build", [
        "buildjscore",
        "buildcsscore",
        "buildjslogin",
        "buildjsangular",
        "buildjsrecheckin",
        "buildjsfanexgrid",
        "buildcssfanexgrid",
        "buildjsbetsetting",
        "buildjslicenseesetting",
        "buildcsslicenseesetting"]);

};