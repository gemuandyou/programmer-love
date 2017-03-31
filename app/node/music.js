/**
 * Created by Gemu on 2017/3/24.
 */
var fs = require('fs');

var prePath = 'app/assets/music';

module.exports = {

    getMusicBox: function() {
        var files = [];
        fs.readdirSync(prePath).forEach(function (file) {
            var filePath = prePath + '/' + file;
            var stats = fs.lstatSync(filePath);
            if (stats.isFile()) {
                files.push({fileName: file, filePath: filePath});
            }
        });
        return files;
    }

};