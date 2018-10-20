const fetch = require('node-fetch');
const cheerio = require('cheerio');
const searchurl = 'https://www.imdb.com/find?s=tt&ttype=tv&ref_=fn_tv&q=';
const tvurl = 'https://www.imdb.com/title/';
const riviewurl = 'https://www.imdb.com/title/';

const searchCache = {};
const tvCache = {};
const reviewsCache = {};

function getReviews(imdbid){
	if(reviewsCache[imdbid]){
		console.log('Data extracted from Cache', imdbid);
		return Promise.resolve(reviewsCache[imdbid]);
	}
	return fetch(`${riviewurl}${imdbid}/reviews?ref_=tt_ov_rt`)
		.then(response => response.text())
		.then(body => {
			const reviews = [];
			const $ = cheerio.load(body);
			$('.lister-item-content').each(function(i, element){
				const $element = $(element);
				const $rtitle = $element.find('div.lister-item-content a').first().contents().filter(function() {
					return this.type === 'text';
				});
				const $rate = $element.find('div.lister-item-content span.rating-other-user-rating')
				const $uname = $element.find('div.lister-item-content div.display-name-date span a');
				const $rdate = $element.find('div.lister-item-content div.display-name-date span.review-date');
				const $rev = $element.find('div.lister-item-content div.content div.text')
				const review = {
					ratint: $rate.text().trim(),
					rtitle: $rtitle.text().trim(),
					uname: $uname.text().trim(),
					rdate: $rdate.text(),
					rev: $rev.text().trim()
				};
				reviews.push(review);
			});
			reviewsCache[imdbid] = reviews;
			return reviews;
		});
}

function searchTV(searchTerm) {
	if(searchCache[searchTerm]){
		console.log('Data extracted from Cache', searchTerm);
		return Promise.resolve(searchCache[searchTerm]);
	}

	return fetch(`${searchurl}${searchTerm}`)
		.then(response => response.text())
		.then(body => {
		const tvseries = [];
		const $ = cheerio.load(body);
		$('.findResult').each(function(i, element){
			const $element = $(element);
			const $image = $element.find('td a img');
			const $title = $element.find('td.result_text a');

			const imdbid = $title.attr('href').match(/title\/(.*)\//)[1];
			const tv = {
				image: $image.attr('src'),
				title: $title.text(),
				imdbid
			};
			tvseries.push(tv);
		});

		searchCache[searchTerm] = tvseries;
		return tvseries;
	});
}


function getTV(imdbid){
	if(tvCache[imdbid]){
		console.log('Data extracted from Cache', imdbid);
		return Promise.resolve(tvCache[imdbid]);
	}

	return fetch(`${tvurl}${imdbid}`)
		.then(response => response.text())
		.then(body => {
			const $ = cheerio.load(body);
			const $title = $('.title_wrapper h1');

			const title = $title.first().contents().filter(function() {
				return this.type === 'text';
			}).text().trim();
			const $rating = $('.ratingValue');
			const rating = $rating.text().trim();
			const runTime = $('time[datetime="PT121M"]').first().contents().filter(function() {
				return this.type === 'text';
			}).text().trim();
			const date = $('a[title="See more release dates"]').text().trim();
			const poster = $('div.poster a img').attr('src');
			const summary = $('div.summary_text').text().trim();
			const trailer = $('div.slate a').attr('href');
			const tv = {
				title,
				rating,
				runTime,
				date,
				poster,
				summary,
				trailer: `https://imdb.com${trailer}`
			};
			tvCache[imdbid] = tv;
			return tv;
		});
}


module.exports = {
	searchTV,
	getTV,
	getReviews
};
