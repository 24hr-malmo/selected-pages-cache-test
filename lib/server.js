var fs = require("fs");
var path = require("path");
var http = require("http");
var express = require('express');
var app = express();
var config = require("../config-manager");
var server = require('http').createServer(app);
var cookieParser = require('cookie-parser');
var doT = require('dot');

doT.templateSettings = {
    evaluate:    /\{\{([\s\S]+?)\}\}/g,
    interpolate: /\{\{=([\s\S]+?)\}\}/g,
    encode:      /\{\{!([\s\S]+?)\}\}/g,
    use:         /\{\{#([\s\S]+?)\}\}/g,
    define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
    conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
    iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
    varname: 'it',
    strip: false,
    append: true,
    selfcontained: false
};

var doT = require('express-dot');

function init(options, next) {

    if (typeof options === "function") {
        next = options;
    }

    options = options || {};

    // Define where the public files are
    app.use(express.static(path.join(__dirname, '../public')));

    app.use(cookieParser());

    // define rendering engine
    app.set('views', path.join(__dirname, "../views"));
    app.set('view options', { layout: false });
    app.set('view engine', 'html' );
    app.engine('html', doT.__express );

    server.listen(config.server.port, function() {

         // Load all api endpoints
        var routes = require('./routes');
        for(var i = 0, ii = routes.length; i < ii; i++){
            app.use('/', routes[i]);
        }

        if (typeof next === "function") {
            next();
        }

    });

}

exports.init = init;

exports.close = function(done) {
    server.close(done);
};



