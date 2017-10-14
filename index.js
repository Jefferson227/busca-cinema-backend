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
      var __tdd = 'Nothing';
      str = '';

      $('script').each(function (i, el) {
        if (i === 17) {
          str = $(el).html() + '<br>';
          str = str.replace('var __tdd', '__tdd');
          eval(str);
          //console.log(__tdd);
        }
      });

      // $('.row.theater-detail-movie').each(function (index, element) {
      //   var title = $(element)
      //     .find('.theater-detail-movie-title').html();
      //   var showtimeAttribute = $(element)
      //     .find('.showtime-attribute').html();
      //   var runtime = $(element)
      //     .find('.theater-detail-movie-rating-runtime').html();
      //   var showtimes = $(element)
      //     .find('.button-group.showtime').html();

      //   str += title + '<br>' +
      //     showtimeAttribute   + '<br>' +
      //     runtime             + '<br>' +
      //     showtimes           + '<br>' +
      //     '<br><br>';
      // });

      // $('h4.theater-detail-movie-title').each(function (index, element) {
      //   var str2 = '';
      //   var showtimeAttribute = $(element)
      //     .find('.showtime-attribute');

      //   $(showtimeAttribute).each(function (i, el) {
      //     str2 += $(el).html() + ' ';
      //   });

      //   str += $(element).html() + '<br>' + str2 + '<br><br>';
      // });

      // $(movie).each(function (index, element) {
      //   var name = $(element).find('.theater-detail-movie-title').html();
      //   var runtime = $(element).find('.theater-detail-movie-rating-runtime').html();
      //   str += 'name: ' + name + ', runtime: ' + runtime + '<br>';
      // });

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