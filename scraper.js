const fetch = require('node-fetch');
const cheerio = require('cheerio');

const url = 'https://www.imdb.com/find?s=tt&ttype=tv&ref_=fn_tv&q=';

function searchTV(searchTerm) {
  return fetch(`${url}${searchTerm}`)
    .then(response => response.text())
    .then(body => {
      const tvseries = [];
      const $ = cheerio.load(body);
      $('.findResult').each(function(i, element) {
        const $element = $(element);
        // console.log($element.text());
        const $image = $element.find('td a img');
        const $title = $element.find('td.result_text a');
        // console.log($image.attr('src'));
        const tv = {
          image: $image.attr('src'),
          title: $title.text()
        };

        tvseries.push(tv);
      });

      return tvseries;
    });

}

module.exports = {
  searchTV
}
