const path = require('path');

const cssPaths = {
    // output path
    build: './reactpages/dist/css',

    // components css input source paths
    demo: './reactpages/src/styles/modules/demo'
};

const scriptPaths = {
    // output path
    build: './reactpages/dist/js',

    // components css input source paths
    demo: './reactpages/src/scripts/modules/demo'
};

module.exports = {
    projectRoot: path.resolve(__dirname, '../../'),
    cssPaths: cssPaths,
    scriptPaths: scriptPaths
};