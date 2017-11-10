var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var requestPromise = require('request-promise');
var app = express();
var baseUrl = 'https://www.tribute.ca';
var partnership = '/partnership/0';
var port = process.env.PORT || 3000;

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return next();
});

app.get('/', function (req, res) {
  res.send('Hello this is the busca-cinema-backend :)');
});

app.get('/events/city/:id', function (req, res) {
  var url = baseUrl + '/events/city/' + req.params.id + partnership;

  request(url, function (error, response, html) {
    if (!error) {
      res.send(html || []);
    }
    else {
      res.send(error);
    }
  });
});

app.get('/events/:id', function (req, res) {
  var url = baseUrl + '/events/' + req.params.id + partnership;

  request(url, function (error, response, html) {
    if (!error) {
      res.send(html || []);
    }
    else {
      res.send(error);
    }
  });
});

app.get('/events/:id', function (req, res) {
  var url = baseUrl + '/events/' + req.params.id + partnership;

  request(url, function (error, response, html) {
    if (!error) {
      res.send(html || []);
    }
    else {
      res.send(error);
    }
  });
});

app.get('/sessions/city/:cityId/event/:movieId/date/:date', function (req, res) {
  var url = baseUrl + '/sessions/city/' + req.params.cityId + '/event/' + req.params.movieId + partnership + '?date=' + req.params.date;

  request(url, function (error, response, html) {
    if (!error) {
      res.send(html || []);
    }
    else {
      res.send(error);
    }
  });
});

app.get('/movies', function (req, res) {
  var options = {
    uri: `${baseUrl}/movies/now-playing`,
    transform: function (body) {
        return cheerio.load(body);
    }
  };

  requestPromise(options)
    .then(($) => {
      let movies = $('#rowheight').children('li');
      let arrayMovies = [];

      $(movies).each((i, movie) => {
        arrayMovies.push({
          id: $(movie).find('a').attr('href').split('/')[3],
          name: $(movie).find('#phShowtimesLink').find('span').text().trim()
                  || $(movie).find('.trailer').find('span').text().trim()
                  || $(movie).find('.synopsis').find('span').text().trim(),
          img: $(movie).find('a').find('img').data('src')
                  || $(movie).find('a').find('img').attr('src')
        });
      });

      res.send(arrayMovies);
    });
});

app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});