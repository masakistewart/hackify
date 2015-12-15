var express = require('express'),
	router = express.Router(),
	favicon = require('serve-favicon'),
	bodyparse = require('body-parser'),
	morgan = require('morgan'),
	bodyparse = require('body-parser'),
	requesticles = require('../model/requesticles');
	prettyjson = require('prettyjson');

var search = null,
	seachData = null;

router.get('/',function(req,res) {
  res.render('pages/index');
 });

router.post('/artists',function(req,res) {
  search = req.body.artistName;
  requesticles.initialSearch(search, res);
 });

router.get('/albums/:name/:id',function(req,res) {
  requesticles.albumSearch(req, res);
 });

router.get('/albums/:artist/:albums/:id',function(req,res) {
  requesticles.albumsTracksSearch(req, res);
 });

module.exports = router;