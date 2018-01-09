var express = require('express');
var utilsModule = require('./utils');
var utils = utilsModule();
var app = express();
var baseUrl = 'https://www.tribute.ca';
var port = process.env.PORT || 3000;
var swaggerUi = require('swagger-ui-express')
var swaggerDocument = require('./swagger.json');

// Swagger configuration
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Setting header config to avoid CORS problem
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

      // Filtering the movie by id
      let selectedMovie =
        movies
          .find((f) => parseInt(f.id) === parseInt(movieId));

      if (selectedMovie.hasOwnProperty('id')) {
        utils
          .getTheaters(city)
            .then((theaters) => {
              // Getting all the theaters
              let sessionsPromises = [];

              theaters
                .forEach((theater) => {
                  sessionsPromises
                    .push(
                      utils
                        .getSessionsByTheater(theater.id, date)
                          .then((sessionsByTheater) => {
                            // Getting sessions for each theater
                            let filteredSessions =
                              sessionsByTheater
                                .find((f) => f.movieId === movieId);

                            return Object.assign(theater, filteredSessions);
                          })
                    );
                });

                Promise
                  .all(sessionsPromises)
                  .then((sessionsByMovie) => {
                    // Filtering the array for those theaters which has sessions available
                    let _theatersWithSessions =
                      sessionsByMovie
                        .filter((session) => {
                          return session.hasOwnProperty('showtimes');
                        });

                    let theatersWithSessions = [];

                    if (_theatersWithSessions.length) {
                      theatersWithSessions = {
                        title: _theatersWithSessions[0].movie,
                        rating: _theatersWithSessions[0].rating,
                        genre: _theatersWithSessions[0].genre.trim(),
                        runtime: _theatersWithSessions[0].runtime.trim(),
                        sessions: _theatersWithSessions
                                    .map((a) => {
                                      return {
                                        theater: a.name,
                                        showtimes: a.showtimes.reduce((x, y) => {
                                          return x.concat(y);
                                        }, [])
                                      };
                                    })
                      }
                    }

                    console.log(theatersWithSessions);
                    res.send(theatersWithSessions);
                  });
            })
            .catch((err) => {
              res.send({ error: "Error on getting the theaters." });
            });
      }
      else {
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