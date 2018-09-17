const pathConfig = require('../config/path');
const fs = require('fs');

class BundleVersionPlugin {
    _onEmit(compilation, callback) {
        const siteConfigPath = `${pathConfig.projectRoot}/SiteConfig`;
        fs.readdir(siteConfigPath, (err, files) => {
            files.filter(name => name.match(/Web\.AppSettings\.[^\.]+\.config/i))
                .forEach(name => {
                    const filePath = `${siteConfigPath}/${name}`;
                    const content = fs.readFileSync(filePath, 'utf8');
                    let isChanged = false;

                    const newContent = content.replace(/BundlesVersion[^>]+value="([^"]+)"[^>]+>/, function (matchedString, buildNumber) {
                        return (isChanged = (compilation.hash !== buildNumber))
                            ? matchedString.replace(buildNumber, compilation.hash)
                            : matchedString;
                    });

                    if (isChanged) {
                        fs.writeFile(filePath, newContent);
                    }
                });
        })

        callback();
    }

    apply(compiler) {
        compiler.plugin('emit', this._onEmit);
    }
}

module.exports = BundleVersionPlugin;