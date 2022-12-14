const path = require("path");

const pathToRootPublic = "../Hotwired-003-AdminUICompiled/public/";

module.exports = {
    outputDir: pathToRootPublic,
    transpileDependencies: true,
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000'
        }
      }
    }
}