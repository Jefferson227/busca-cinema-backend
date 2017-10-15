var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var app = express();
var baseUrl = 'https://api-content.ingresso.com/v0';
var partnership = '/partnership/0';

app.get('/', function (req, res) {
  var url = 'http://www.movietickets.com/theaters/detail/id/ti-6166';

  request(url, function (error, response, html) {
    if (!error) {
      res.send(str);
    }
    else {
      res.send(error);
    }
  });
});

app.get('/events/city/:id', function (req, res) {
  var url = baseUrl + '/events/city/' + req.params.id + partnership;

  request(url, function (error, response, html) {
    if (!error) {
      res.send(html);
    }
    else {
      res.send(error);
    }
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});