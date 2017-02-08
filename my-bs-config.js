/**
 * Created by gemu on 1/24/17.
 */
var http_proxy = require('http-proxy');
var db = require('./app/node/db');
var proxy = http_proxy.createProxyServer({
    target: 'http://localhost:8080/myrest/'
});

var api = function (req, res, next) {
    if (/\/api\/.*$/.test(req.url)) {
        proxy.web(req, res);
    } else if (/\/rnote\/.*$/.test(req.url)) {
        var data = db.loadNotes(req.url.substr(6));
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(data.toString());
        res.end();
    } else if (/\/wnote\/.*$/.test(req.url)) {
        var body = [];
        req.on('data', function (chunk) {
            body.push(chunk);
        });
        req.on('end', function () {
            body = Buffer.concat(body);
            db.writeNotes(req.url.substr(6), body.toString());
        });
        res.end();
    } else if (/\/lnote/.test(req.url)) {
        var data = db.listNotes();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(data.toString());
        res.end();
    } else if (/\/wimg/.test(req.url)) {
        var body = [];
        req.on('data', function (chunk) {
            body.push(chunk);
        });
        req.on('end', function () {
            body = Buffer.concat(body);
            body = JSON.parse(body.toString());
            body = body.data;
            var suffix = body.substring(body.indexOf('/') + 1, body.indexOf(';'));
            var base64Data = body.replace(/^data:image\/\w+;base64,/, "");
            var path = db.writeImg('/' + new Date().getTime() + '.' + suffix, base64Data);
            console.log(path);
            res.write(path);
            res.end();
        });
    } else {
        next();
    }
};

module.exports = {
    server: {
        middleware: [api]
    }
};