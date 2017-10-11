var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var app = express();

app.get('/', function (req, res) {
  var url = 'http://www.movietickets.com/theaters/detail/id/ti-6166';

  request(url, function (error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);
      var movie = $('row.theater-detail-movie');
      var name = $(movie).find('.theater-detail-movie-title').html();
      var runtime = $(movie).find('.theater-detail-movie-rating-runtime').html();
      var str = 'Name: ' + name + ', runtime: ' + runtime;
      str = '';

      $('h4.theater-detail-movie-title').each(function (index, element) {
        str += $(element).html() + '<br>';
      });

      $(movie).each(function (index, element) {
        var name = $(element).find('.theater-detail-movie-title').html();
        var runtime = $(element).find('.theater-detail-movie-rating-runtime').html();
        str += 'name: ' + name + ', runtime: ' + runtime + '<br>';
      });

      res.send(str);
    }
    else {
      res.send(error);
    }
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});