const path = require('path');

const cssPaths = {
    // output path
    build: './reactpages/dist/css',

    // components css input source paths
    demo: './reactpages/src/styles/modules/demo',
    editvendor: './reactpages/src/styles/modules/vendor/index.scss'
};

const scriptPaths = {
    // output path
    build: './reactpages/dist/js',

    // components js input source paths
    demo: './reactpages/src/scripts/modules/demo',
    vendor: './reactpages/src/scripts/modules/vendor/list',
    editvendor: './reactpages/src/scripts/modules/vendor/edit'
};

module.exports = {
    projectRoot: path.resolve(__dirname, '../../'),
    cssPaths: cssPaths,
    scriptPaths: scriptPaths
};