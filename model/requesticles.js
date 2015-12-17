var requestMOD = require('request');
var artistID,
	artist;
var requesticles = {
	'initialSearch': function(search, res) {
		var data;
		if (search !== '') {
			requestMOD('https://api.spotify.com/v1/search?q=' + search + "&type=artist&limit=20", function(err, request, body) {
				data = JSON.parse(body);
				console.log(data);
				if(data.artists.items.length !== 0) {
					var data2 = data.artists.items;
					res.render('pages/artists', {artists: data2});
				} else {
					res.render('pages/fourohfour', {error: {status: 404, message: 'search was empty'}})
				}
			});
		} else {
			res.status(404);
			res.render('pages/fourohfour', {error: {status: 404, message: 'search was empty'}})
		}
	},
	'albumSearch': function(request, response) {
		artistID = request.params.id;
		artist = request.params.name;
		requestMOD('https://api.spotify.com/v1/artists/'+ artistID +'/albums?album_type=album', function(err, res, body) {
			console.log('searching...');
			if(body) {
				var b = JSON.parse(body);
				albumData = b.items,
				albumDataArr = [],
				obj = {
					names: [],
					popularity: [],
					albumCover: [],
					id: []
				},
				counter = 0,
				albumsPop = [],
				names = [],
				limiter = {};
				if(albumData.length !== 0) {
					albumData.forEach(function(album) {
						if(limiter[album.name] === undefined) {
							counter++;
							limiter[album.name] = 1;
							obj.names.push(album.name);
							obj['albumCover'].push(album.images[0].url);
							obj.id.push(album.id);
							album.mainIMG = album.images[0].url;
							albumDataArr.push(album);
							requestMOD('https://api.spotify.com/v1/albums/' + album.id, function(errp, resp, bodyp) {
								if(bodyp) {
									var popData = JSON.parse(bodyp).popularity;
									albumsPop.push(popData);
									obj.popularity.push(popData);
								}
								console.log(obj);
								if (albumsPop.length === counter) {
									response.render('pages/albums', {artist: artist, everything: obj});
								}
							})
						}
					})
				} else {
					response.status(404);
					response.render('pages/fourohfour', {error: {status: 404, message: "Artist Album Not Found!"}})
				}
			}
		})
	},
	'albumsTracksSearch': function(req, res) {
		var albumID = req.params.id;
		var tracks = null;
		var	artist = req.params.artist;
		var preAlbum = req.params.albums;
		var album = preAlbum.replace(/'%20'/g, ' ');
		requestMOD('https://api.spotify.com/v1/albums/' + albumID + '/tracks', function(err, resp, body) {
			tracks = JSON.parse(body).items;
			if(tracks !== undefined) {
				requestMOD('https://api.spotify.com/v1/albums/' + albumID, function(err2, resp2, body2) {
					var releaseDate = JSON.parse(body2).release_date;
					var image = JSON.parse(body2).images[0].url;
					res.render('pages/tracks', {artist: artist, tracks: tracks, album: album, release_date: releaseDate, image: image});
				})
			} else {
				var err = JSON.parse(body).error;
				res.status(404);
				res.render('pages/fourohfour', {error: err});
			}
		})
	}
}

module.exports = requesticles;