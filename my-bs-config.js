/**
 * Created by gemu on 1/24/17.
 */
var http_proxy = require('http-proxy');
var logger = require("eazy-logger").Logger({
    prefix: "debugger-info-> ",
    useLevelPrefixes: false
});

var db = require('./app/node/db');
var music = require('./app/node/music');
var apiProxy = http_proxy.createProxyServer({
    target: 'http://localhost:8080/myrest/'
});
var dbServerProxy = http_proxy.createProxyServer({
    target: 'http://localhost:8080/'
});
var fileProxy = http_proxy.createProxyServer({
    target: 'http://localhost:3008/'
});
dbServerProxy.on('proxyReq', function(proxyReq, req, res, options) {
    // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
    proxyReq.setHeader('Content-Type', 'application/json');
});
apiProxy.on('proxyReq', function(proxyReq, req, res, options) {
    // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
    proxyReq.setHeader('Content-Type', 'application/json');
});

var api = function(req, res, next) {
    // logger.info(req.url);
    try {
        if (/^\/api\/.*$/.test(req.url)) {
            req.url = req.url.substring(4);
            apiProxy.web(req, res);
        } else if (/^\/dbs\/.*$/.test(req.url)) {
            req.url = req.url.substring(4);
            dbServerProxy.web(req, res);
        } else if (/^\/fs\/.*$/.test(req.url)) {
            req.url = req.url.substring(3);
            fileProxy.web(req, res);
        } else if (/\/rnote\/.*$/.test(req.url)) {
            var data = db.loadNotes(req.url.substr(6));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(data.toString());
            res.end();
        } else if (/\/wnote\/.*$/.test(req.url)) {
            var body = [];
            req.on('data', function(chunk) {
                body.push(chunk);
            });
            req.on('end', function() {
                body = Buffer.concat(body);
                db.writeNotes(req.url.substr(6), body.toString());
            });
            res.end();
        } else if (/\/lnote/.test(req.url)) {
            var data = db.listNotes();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(data.toString());
            res.end();
        } else if (/\/wimg/.test(req.url)) {
            var body = [];
            req.on('data', function(chunk) {
                body.push(chunk);
            });
            req.on('end', function() {
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
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(files).toString());
            res.end();
        } else if (/\/exportNote/.test(req.url)) {
            var body = [];
            req.on('data', function(chunk) {
                body.push(chunk);
            });
            req.on('end', function() {
                body = Buffer.concat(body);
                body = JSON.parse(body.toString());
                db.exportNote(body['path'], body['html'], body['assets']);
                res.write(body['path']);
                res.end(body['path']);
            });
        } else {
            next();
        }
    } catch (e) {
        console.log(e);
    }
};

module.exports = {
    port: '88',
    ui: {
        port: 3001
    },
    server: {
        middleware: [api]
    }
};