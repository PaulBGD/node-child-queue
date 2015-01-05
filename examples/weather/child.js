var http = require("http");
module.exports = function(input, callback) {
    if (input.type == "weather") {
        http.get('http://api.openweathermap.org/data/2.5/weather?q=' + input.area, function(res) {
            var body = '';

            res.on('data', function(chunk) {
                body += chunk;
            });

            res.on('end', function() {
                try {
                    callback(undefined, JSON.parse(body).weather[0].main);
                } catch (err) {
                    callback(err);
                }
            });
        }).on('error', function(e) {
            callback(e);
        });
    }
};