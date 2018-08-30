var request = require('request');
const cheerio = require('cheerio');

request('https://mckesson.taleo.net/careersection/ex/jobsearch.ftl?lang=en', function (error, response, body) {
	// console.log('error:', error); // Print the error if one occurred
	// console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	// console.log('body:', body); // Print the HTML for the Google homepage.

	const $ = cheerio.load(body);

    const title = [];

	$('a').each(function(i, elem) {
		title[i] = "title: "+$(this).text();
	});

	console.log(title.join("\n "));
});