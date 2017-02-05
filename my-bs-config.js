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
    } else {
        next();
    }
};

module.exports = {
    server: {
        middleware: [api]
    }
};