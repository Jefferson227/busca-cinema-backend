let utils = () => {
  var request = require('request');
  var requestPromise = require('request-promise');
  var cheerio = require('cheerio');
  var moment = require('moment');
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
            img: ($(movie).find('a').find('img').data('src')
                    || $(movie).find('a').find('img').attr('src'))
                      .replace('/160x236/', '/660x980/')
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

  let getSessionsByTheater = (theaterId, date) => {
    let dateFilter =
      date
      ?
        Math.ceil(
          moment(date, 'YYYY-MM-DD')
          .diff(moment(), 'days', true)
        )
      : 0;

    dateFilter =
      dateFilter > 0
        ? `?datefilter=${dateFilter}`
        : '';

    var options = {
      uri: `${baseUrl}/showtimes/theatre/theatre/${theaterId}/${dateFilter}`,
      transform: function (body) {
          return cheerio.load(body);
      }
    };

    return requestPromise(options)
      .then(($) => {
        let arraySessions = [];
        let sessions =
          $('.movielist')
            .find('.movieWrap');

        $(sessions).each((i, session) => {
          let ratingGenreRuntime =
            $(session)
              .find('.rating')
              .text();

          if ($(session).find('h2').find('a').length){
            arraySessions.push({
              movieId:
                $(session)
                  .find('h2')
                  .find('a')
                  .attr('href')
                  .split('/')[3],
              movie:
                $(session)
                  .find('h2')
                  .find('a')
                  .text(),
              rating: extractRating(ratingGenreRuntime),
              genre: extractGenre(ratingGenreRuntime),
              runtime: extractRuntime(ratingGenreRuntime),
              showtimes:
                getShowtimes(
                  $(session)
                    .find('.showoptions')
                )
            });
          }
        });

        function extractRating(str) {
          return str
              .replace('(', '')
              .replace(')', '')
              .split(',')[0]
              .trim();
        }

        function extractGenre(str) {
          let splitted =
            str
              .replace('(', '')
              .replace(')', '')
              .split(',');

          if (splitted.length < 3) {
            return 'N/A';
          }

          return splitted[1];
        }

        function extractRuntime(str) {
          let splitted =
            str
              .replace('(', '')
              .replace(')', '')
              .split(',');

          if (splitted.length < 3) {
            return splitted[1];
          }

          return splitted[2];
        }

        function getShowtimes(showOptions) {
          let showtimes = [];

          $(showOptions)
            .children('.optionWrap')
            .each((i, showOption) => {
              showtimes.push({
                type:
                  $(showOption)
                    .find('h3')
                    .text(),
                times:
                  getTimes($(showOption).find('ul'))
              });
          });

          return showtimes;
        }

        function getTimes(timeList) {
          let times = [];

          $(timeList)
            .children('li')
            .each((i, time) => {
              times.push($(time).text());
            });

           return times;
        }

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