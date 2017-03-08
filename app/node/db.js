/**
 * Created by gemu on 1/26/17.
 */
var fs = require('fs');

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
            if (file != 'img') {
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
    }
};