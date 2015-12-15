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
			if(body) {
				var b = JSON.parse(body);
				var albumData = b.items;
				var albumDataArr = [];
				var obj = {};
				if(albumData.length > 0) {
					albumData.forEach(function(album) {
						if(obj[album.name] === undefined) {
							obj[album.name] = album.images[0].url;
							console.log(album)
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
		var tracks = null;
		var	artist = req.params.artist;
		var preAlbum = req.params.albums;
		var album = preAlbum.replace(/'%20'/g, ' ');
		requestMOD('https://api.spotify.com/v1/albums/' + albumID + '/tracks', function(err, resp, body) {
			console.log(body);
			tracks = JSON.parse(body).items;
			requestMOD('https://api.spotify.com/v1/albums/' + albumID, function(err2, resp2, body2) {
				var releaseDate = JSON.parse(body2).release_date;
					var image = JSON.parse(body2).images[0].url;
				res.render('pages/tracks', {artist: artist, tracks: tracks, album: album, release_date: releaseDate, image: image});
			})
		})
	}
}

module.exports = requesticles;