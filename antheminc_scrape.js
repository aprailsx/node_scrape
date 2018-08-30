var request = require("request")

var url = "https://carefirstcareers.ttcportals.com/search/jobs.json?all_results=true&data_format=map&near_dist_miles=100&per_page=15";

request({
    url: url,
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        
        let num_result = 115;
        
        for (let counter = 0; counter < num_result; counter++)
        {
        	console.log("title: "+body.entries[counter].title);
        }
        
    }
})