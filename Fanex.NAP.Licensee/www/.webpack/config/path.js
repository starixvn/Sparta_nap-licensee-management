const path = require('path');

const cssPaths = {
    // output path
    build: './www/reactpages/dist/css',

    // components css input source paths
    demo: './www/reactpages/src/styles/modules/demo',
    editvendor: './www/reactpages/src/styles/modules/vendor/index.scss',
    createtoken: './www/reactpages/src/styles/modules/lapuser/createtoken.scss',
    createUser: './www/reactpages/src/styles/modules/lapuser/createuser.scss',
    operator: './www/reactpages/src/styles/modules/operator/index.scss',
    licensee: './www/reactpages/src/styles/modules/licensee/licensee.scss',
    licenseelist: './www/reactpages/src/styles/modules/licensee/licenseelist.scss',
    sourceLicensee: './www/reactpages/src/styles/modules/sourcelicensee/index.scss',
    product: './www/reactpages/src/styles/modules/product/index.scss',
    'function': './www/reactpages/src/styles/modules/function/index.scss',
    userList: './www/reactpages/src/styles/modules/user/index.scss',
    user: './www/reactpages/src/styles/modules/user/item.scss',
    volumeControlList: './www/reactpages/src/styles/modules/volumecontrol/index.scss',
    subsidiary: './www/reactpages/src/styles/modules/subsidiary/index.scss'
};

const scriptPaths = {
    // output path
    build: './www/reactpages/dist/js',

    // components js input source paths
    demo: './www/reactpages/src/scripts/modules/demo',
    vendor: './www/reactpages/src/scripts/modules/vendor/list',
    editvendor: './www/reactpages/src/scripts/modules/vendor/edit',
    createToken: './www/reactpages/src/scripts/modules/lapuser/create-token',
    createUser: './www/reactpages/src/scripts/modules/lapuser/create-user',
    operatorlist: './www/reactpages/src/scripts/modules/operator/list',
    operator: './www/reactpages/src/scripts/modules/operator/item',
    importoperator: './www/reactpages/src/scripts/modules/operator/import',
    licensee: './www/reactpages/src/scripts/modules/licensee/list',
    editlicensee: './www/reactpages/src/scripts/modules/licensee/edit',
    sourceLicenseeList: './www/reactpages/src/scripts/modules/sourcelicensee/list',
    sourceLicensee: './www/reactpages/src/scripts/modules/sourcelicensee/add',
    product: './www/reactpages/src/scripts/modules/product',
    functionList: './www/reactpages/src/scripts/modules/function/list',
    'function': './www/reactpages/src/scripts/modules/function/item',
    userList: './www/reactpages/src/scripts/modules/user/list',
    editUser: './www/reactpages/src/scripts/modules/user/edit',
    addUser: './www/reactpages/src/scripts/modules/user/add',
    volumeControlList: './www/reactpages/src/scripts/modules/volumecontrol/list',
    volumeControlAddSetting: './www/reactpages/src/scripts/modules/volumecontrol/add',
    addSubsidiary: './www/reactpages/src/scripts/modules/subsidiary/add'
};

module.exports = {
    projectRoot: path.resolve(__dirname, '../../../'),
    cssPaths: cssPaths,
    scriptPaths: scriptPaths
};