var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var requestPromise = require('request-promise');
var app = express();

app.get('/', function (req, res) {
  var url = 'http://www.movietickets.com/theaters/detail/id/ti-6166';

  request(url, function (error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);

      res.send('This implementation is on progress');
    }
    else {
      res.send(error);
    }
  });
});

app.get('/theaters/:city', function (req, res) {
  var url = 'https://www.movietickets.com/search?indexCatalogue=www-site&searchQuery=' + req.params.city + '&wordsMode=AllWords';

  request(url, function (error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);
      var theaters = [];

      $('.search-grouping').each(function (i, el) {
        var theater = {
          id      : $(el).find('.search-link').html()
            .split('/')[6]
            .split('-')[1],
          name    : $(el).find('.search-item a').html(),
          address : $(el).find('.search-descript').html(),
          link    : $(el).find('.search-link').html()
        };

        theaters.push(theater);
      });

      res.send(theaters);
    }
    else {
      res.send(error);
    }
  });
});

app.get('/theater/:theaterId/movies', function (req, res) {
  var url = 'http://www.movietickets.com/theaters/detail/id/ti-' + req.params.theaterId;

  request(url, function (error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);
      var result = {};

      $('script').each(function (i, el) {
        var strJson = $(el).html();

        if (strJson.indexOf('var __tdd') > -1) {
          var startIndex = strJson.indexOf('var __tdd');
          var size       = strJson.indexOf('var __tdm') - strJson.indexOf('var __tdd');
          var __tdd      = '';
          var __tdm      = '';

          __tdd  = strJson.substr(startIndex, size);
          __tdd  = __tdd.replace('var __tdd = ', '').replace(';', '').trim();

          startIndex = strJson.indexOf('var __tdm');
          size       = strJson.indexOf('var __metadata') - strJson.indexOf('var __tdm');

          __tdm  = strJson.substr(startIndex, size);
          __tdm  = __tdm
                    .replace(/var __tdm = /g, '')
                    .replace(/;/g, '')
                    .replace(/\\n/g, '')
                    .trim();

          result = JSON.parse(__tdm);
        }
      });

      res.send(result);
    }
    else {
      res.send(error);
    }
  });
});

app.get('/movies', function (req, res) {
  var url = 'http://www.movietickets.com/movies';

  request(url, function (error, response, html) {
    if (!error) {
      var $      = cheerio.load(html);
      var result = '';

      $('script').each(function (i, el) {
        var strJson = $(el).html();

        if (strJson.indexOf('MovielandingJsonObject') > -1) {
          result = strJson.replace('var MovielandingJsonObject = ', '').replace(';', '');
        }
      });

      var movies = [];
      var jsonMovies = JSON.parse(result).MoviesNowPlaying
        .map(function (item) {
          var genres = item.Genre
            .map(function (genre) {
              return genre.Attributes.Name;
            });

          var id = item.LinkUrl.split('/')[6]
            .split('-')[1];

          return {
            id            : id,
            title         : item.Details.Name,
            duration      : item.Details.RuntimeInMinutes,
            contentRating : item.Details.Rating,
            images        : [{
              url: item.Details.PosterUrl.replace('{width}', '800').replace('{height}', '600')
            }],
            genres        : genres
          }
        });

      res.send(jsonMovies);
    }
    else {
      res.send(error);
    }
  });
});

app.get('/movie/:movieId/sessions', function (req, res) {
  getMovieById()
    .then((r) => console.log('aehooooooo'));

  function getMovieById() {
    // Getting all movies and filtering by id
    var result = 'not found';
    var options = {
        uri: 'https://www.movietickets.com/movies',
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    return requestPromise(options)
      .then(($) => {
        $('script').each(function (i, el) {
          var strJson = $(el).html();

          if (strJson.indexOf('MovielandingJsonObject') > -1) {
            result = strJson.replace('var MovielandingJsonObject = ', '').replace(';', '');
          }
        });
        res.send(result);
      });
  }

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});