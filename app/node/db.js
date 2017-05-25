/**
 * Created by gemu on 1/26/17.
 */
var fs = require('fs');
var phantom = require('phantom');

var prePath = 'app/assets/db';

module.exports = {

    // travelFile: function(dir, callback) {
    //     fs.readdirSync(dir).forEach(function (file) {
    //         var pathname = path.join(dir, file);
    //
    //         if (fs.statSync(pathname).isDirectory()) {
    //             travelFile(pathname, callback);
    //         } else {
    //             callback(pathname);
    //         }
    //     });
    // },

    listNotes: function() {
        var files = [];
        fs.readdirSync(prePath).forEach(function (file) {
            if (file != 'img' && file != 'freehand') {
                files.push(file);
            }
        });
        return files;
    },

    loadNotes: function (path) {
        path = prePath + path;
        if (!fs.existsSync(path)) {
            return fs.openSync(path, 'w+');
        }
        return fs.readFileSync(path);
    },

    writeNotes: function(path, content) {
        path = prePath + path;
        fs.writeFile(path, content);
    },

    writeImg: function(path, base64Data) {
        path = prePath + '/img' + path;
        var dataBuffer = new Buffer(base64Data, 'base64');
        fs.writeFile(path, dataBuffer);
        return path;
    },

    exportNote: function(path, html, assets) {
        var basePath = path.substring(0, path.lastIndexOf('/'));
        if (!basePath) return;
        if (!fs.existsSync(basePath)) {
            fs.mkdirSync(basePath);
        }
        fs.writeFile(path, html);
        for (var index in assets) {
            var assetPath = assets[index];
            assetPath = assetPath.substring(assetPath.indexOf('/app/') + 1);
            if (fs.existsSync(assetPath)) {
                var file = fs.readFileSync(assetPath);
                if (!fs.existsSync(basePath + '/assets/')) {
                    fs.mkdirSync(basePath + '/assets/');
                }
                var filePath = basePath + '/assets/' + assetPath.substring(assetPath.lastIndexOf('/') + 1);
                fs.writeFile(filePath, file);
            }
        }
        phantom.create().then(function(ph) {
            ph.createPage().then(function(page) {
                console.log(path);
                page.open('file:///' + path).then(function(status) {
                    console.log(status);
                    page.render('D:/test/test.pdf').then(function() {
                        ph.exit();
                    });
                });
            });
        });
    }
};