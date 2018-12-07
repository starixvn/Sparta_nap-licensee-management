const path = require('path');

const cssPaths = {
    // output path
    build: './www/reactpages/dist/css',

    // components css input source paths
    demo: './www/reactpages/src/styles/modules/demo',
    editvendor: './www/reactpages/src/styles/modules/vendor/index.scss',
    operator: './www/reactpages/src/styles/modules/operator/index.scss',
    licensee: './www/reactpages/src/styles/modules/licensee/licensee.scss',
    licenseelist: './www/reactpages/src/styles/modules/licensee/licenseelist.scss'
};

const scriptPaths = {
    // output path
    build: './www/reactpages/dist/js',

    // components js input source paths
    demo: './www/reactpages/src/scripts/modules/demo',
    vendor: './www/reactpages/src/scripts/modules/vendor/list',
    editvendor: './www/reactpages/src/scripts/modules/vendor/edit',
    operatorlist: './www/reactpages/src/scripts/modules/operator/list',
    operator: './www/reactpages/src/scripts/modules/operator/item',
    importoperator: './www/reactpages/src/scripts/modules/operator/import',
    licensee: './www/reactpages/src/scripts/modules/licensee/list',
    addlicensee: './www/reactpages/src/scripts/modules/licensee/add',
    editlicensee: './www/reactpages/src/scripts/modules/licensee/edit'
};

module.exports = {
    projectRoot: path.resolve(__dirname, '../../../'),
    cssPaths: cssPaths,
    scriptPaths: scriptPaths
};