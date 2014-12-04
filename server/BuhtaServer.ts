/// <reference path="lib/node.d.ts" />
/// <reference path="DesignerService.ts" />
/// <reference path="SqlService.ts" />

var fake=3;
var debug = require('debug')('zz-webstorm');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');
var url = require("url");
//var queryString = require("querystring");

app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('www'));
app.use('/tables',express.static('../../zz-tables'));

SqlService.start(app);
DesignerService.start(app);

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});


//app.get('/sql', function (req, res) {
//    res.send('hello world');
//});


