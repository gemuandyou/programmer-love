/**
 * Created by gemu on 1/24/17.
 */
var http_proxy = require('http-proxy');
var db = require('./app/node/db');
var music = require('./app/node/music');
var apiProxy = http_proxy.createProxyServer({
    target: 'http://localhost:8080/myrest/'
});
var fileProxy = http_proxy.createProxyServer({
    target: 'http://localhost:3008/'
});

var api = function (req, res, next) {
    if (/^\/api\/.*$/.test(req.url)) {
        apiProxy.web(req, res);
    } else if (/^\/fs\/.*$/.test(req.url)) {
        req.url = req.url.substring(3);
        fileProxy.web(req, res);
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
    } else if (/\/musicBox/.test(req.url)) {
        var files = music.getMusicBox();
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(files).toString());
        res.end();
    } else if (/\/exportNote/.test(req.url)) {
        var body = [];
        req.on('data', function (chunk) {
            body.push(chunk);
        });
        req.on('end', function () {
            body = Buffer.concat(body);
            body = JSON.parse(body.toString());
            db.exportNote(body['path'], body['html'], body['assets']);
            res.write(body['path']);
            res.end(body['path']);
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