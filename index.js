var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var app = express();
var cors = require('cors');
var baseUrl = 'https://api-content.ingresso.com/v0';
var partnership = '/partnership/0';
var port = process.env.PORT || 3000;

app.use(cors());

app.get('/', function (req, res) {
  var url = 'http://www.movietickets.com/theaters/detail/id/ti-6166';

  request(url, function (error, response, html) {
    if (!error) {
      res.send('Hello this is the busca-cinema-backend :)');
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

app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});