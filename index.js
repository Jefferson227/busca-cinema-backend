var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
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

app.get('/can/theaters/:city', function (req, res) {
  var url = 'https://www.movietickets.com/search?indexCatalogue=www-site&searchQuery=' + req.params.city + '&wordsMode=AllWords';

  request(url, function (error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);
      var theaters = [];

      $('.search-grouping').each(function (i, el) {
        var theater = {
          name: $(el).find('.search-item a').html(),
          address: $(el).find('.search-descript').html(),
          link: $(el).find('.search-link').html()
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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});