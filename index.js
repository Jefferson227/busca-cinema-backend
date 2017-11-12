var express = require('express');
var utilsModule = require('./utils');
var utils = utilsModule();
var app = express();
var baseUrl = 'https://www.tribute.ca';
var port = process.env.PORT || 3000;

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return next();
});

app.get('/', function (req, res) {
  res.send('Hello this is the busca-cinema-backend :)');
});

app.get('/movies', function (req, res) {
  utils
    .getMovies()
      .then((r) => {
        res.send(r);
      })
      .catch((err) => {
        res.send({ error: "Couldn't get the movies." });
      });
});

app.get('/theaters/:cityId', function (req, res) {
  utils
    .getTheaters(req.params.cityId)
      .then((r) => {
        res.send(r);
      })
      .catch((err) => {
        res.send({ error: "Couldn't get the theaters." });
      });
});

app.get('/sessions/:theaterId/:date', function (req, res) {
  utils
    .getSessionsByTheater(req.params.theaterId, req.params.date)
      .then((r) => {
        res.send(r);
      })
      .catch((err) => {
        res.send(err);
      });
});

app.get('/movie/:movieId/theaters/:city/:date', function (req, res) {
  let movieId = req.params.movieId;
  let city = req.params.city;
  let date = req.params.date;
  let sessionsByMovie = [];

  utils
    .getMovies()
    .then((movies) => {
      console.log(`Getting movies and filtering it by the id ${movieId}`);

      let selectedMovie =
        movies
          .find((f) => parseInt(f.id) === parseInt(movieId));

      if (selectedMovie.hasOwnProperty('id')) {
        utils
          .getTheaters(city)
            .then((theaters) => {
              console.log('Getting theaters...');

              let sessionsPromise = new Promise((resolve, reject) => {
                resolve(
                  theaters
                    .map((theater) => {
                      utils
                        .getSessionsByTheater(theater.id, date)
                          .then((sessionsByTheater) => {
                            console.log(`Getting session from ${theater.name}`);
                            return sessionsByTheater.movieId === movieId;
                          });
                    })
                  );
              });

              sessionsPromise
                .then((filteredSessions) => {
                  console.log('Getting sessions by theater...');

                  res.send(filteredSessions || []);
                });
            })
            .catch((err) => {
              res.send({ error: "Error on getting the theaters." });
            });
      }
      else {
        console.log("Couldn't find the selected movie.");
        res.send({ error: "Couldn't find the selected movie." });
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});