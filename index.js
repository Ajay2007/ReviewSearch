const express = require('express');

const scraper = require('./scraper');

const app = express();

app.get('/', (req, res) => {
	res.json({
		message: 'Scraping is Fun!'
	});
});

app.get('/search/:title', (req, res) => {
	scraper
	.searchTV(req.params.title)
	.then(tvseries => {
		res.json(tvseries);
	});

});

app.get('/tv/:imdbid', (req, res) => {
	scraper
	.getTV(req.params.imdbid)
	.then(tv => {
		res.json(tv);
	});

});

app.get('/reviews/:imdbid', (req, res) => {
	scraper
	.getReviews(req.params.imdbid)
	.then(reviews => {
		//JSON.stringify(reviews, null, "\n");
		res.json(reviews);
	});

});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Listening on ${port}`);
});
