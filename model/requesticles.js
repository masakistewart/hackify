var requestMOD = require('request');
var artistID,
	artist;
var requesticles = {
	'initialSearch': function(search, res) {
		var data;
		requestMOD('https://api.spotify.com/v1/search?q=' + search + "&type=artist&limit=10", function(err, request, body) {
			data = JSON.parse(body);
			var data2 = data.artists.items;
			console.log(data2[0]);
			res.render('pages/artists', {artists: data2});
		});
	},
	'albumSearch': function(request, response) {
		artistID = request.params.id;
		artist = request.params.name;
		requestMOD('https://api.spotify.com/v1/artists/'+ artistID +'/albums?album_type=album', function(err, res, body) {
			console.log('searching...');
			var obj = {};
			if(body) {
				var b = JSON.parse(body);
				var albumData = b.items;
				var albumDataArr = [];
				if(albumData.length > 0) {
					albumData.forEach(function(album) {
						if(obj[album.name] === undefined) {
							obj[album.name] = 0;
							console.log(album.images)
							album.mainIMG = album.images[0].url;
							albumDataArr.push(album);
						}
					})
				}
			}
			response.render('pages/albums', {albums: albumDataArr, artist: artist});
		})
	},
	'albumsTracksSearch': function(req, res) {
		var albumID = req.params.id;
		requestMOD('https://api.spotify.com/v1/albums/' + albumID + '/tracks', function(err, res, body) {
			var tracks = JSON.parse(body).items[0].name;
			console.log(tracks);
		})
	}
}

module.exports = requesticles;