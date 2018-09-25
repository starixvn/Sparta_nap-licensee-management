const path = require('path');

const cssPaths = {
    // output path
    build: './www/reactpages/dist/css',

    // components css input source paths
    demo: './www/reactpages/src/styles/modules/demo',
    editvendor: './www/reactpages/src/styles/modules/vendor/index.scss',
    operator: './www/reactpages/src/styles/modules/operator/index.scss'
};

const scriptPaths = {
    // output path
    build: './www/reactpages/dist/js',

    // components js input source paths
    demo: './www/reactpages/src/scripts/modules/demo',
    vendor: './www/reactpages/src/scripts/modules/vendor/list',
    editvendor: './www/reactpages/src/scripts/modules/vendor/edit',
    operator: './www/reactpages/src/scripts/modules/operator/list'
};

module.exports = {
    projectRoot: path.resolve(__dirname, '../../../'),
    cssPaths: cssPaths,
    scriptPaths: scriptPaths
};