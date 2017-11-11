let utils = () => {
  var request = require('request');
  var requestPromise = require('request-promise');
  var cheerio = require('cheerio');
  var baseUrl = 'https://www.tribute.ca';

  let getMovies = () => {
    var options = {
      uri: `${baseUrl}/movies/now-playing`,
      transform: function (body) {
          return cheerio.load(body);
      }
    };

    return requestPromise(options)
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

        return arrayMovies;
      });
  }

  let getTheaters = (cityId) => {
    var options = {
      uri: `${baseUrl}/showtimes/search/${cityId}/?query=${cityId}&category=all`,
      transform: function (body) {
          return cheerio.load(body);
      }
    };

    return requestPromise(options)
      .then(($) => {
        let theaters =
          $('#mapMarkerNamesAndLinksToTheatres')
            .find('ul')
            .children('li');
        let arrayTheaters = [];

        $(theaters).each((i, theater) => {
          arrayTheaters.push({
            id:
              $($(theater)
                .find('a')[1])
                .attr('href')
                .split('/')[4],
            name:
              $($(theater)
                .find('a')[1])
                .text(),
            uri:
              $($(theater)
                .find('a')[1])
                .attr('href')
          });
        });

        return arrayTheaters;
      });
  }

  let getSessionsByTheater = (theaterId) => {
    var options = {
      uri: `${baseUrl}/showtimes/theatre/theatre/${theaterId}`,
      transform: function (body) {
          return cheerio.load(body);
      }
    };

    return requestPromise(options)
      .then(($) => {
        let sessions =
          $('.movielist')
            .find('.movieWrap');
        let arraySessions = [];

        $(sessions).each((i, session) => {
          console.log($(session).html());
          // arraySessions.push({
          //   id: $(movie).find('a').attr('href').split('/')[3],
          //   name: $(movie).find('#phShowtimesLink').find('span').text().trim()
          //           || $(movie).find('.trailer').find('span').text().trim()
          //           || $(movie).find('.synopsis').find('span').text().trim(),
          //   img: $(movie).find('a').find('img').data('src')
          //           || $(movie).find('a').find('img').attr('src')
          // });
        });

        return arraySessions;
      });
  }

  return {
    getMovies: getMovies,
    getTheaters: getTheaters,
    getSessionsByTheater: getSessionsByTheater
  };
};

module.exports = utils;