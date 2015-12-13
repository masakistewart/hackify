var express = require('express'),
	app = express(),
	favicon = require('serve-favicon'),
	request = require('request');
	bodyparse = require('body-parser'),
	morgan = require('morgan'),
	bodyparse = require('body-parser'),
	prettyjson = require('prettyjson'),
	routes = require('./controller/routes.js'),

app.use(express.static('public'))
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyparse.urlencoded({ extended: false }));
app.use(morgan('combined'));
app.set('view engine', 'ejs');
app.use('/', routes).listen(8080);
