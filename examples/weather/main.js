var Queue = require("../../");
var queue = new Queue(require.resolve("./child"));
queue.request({type: "weather", area: "New York"}, function(err, result) {
    if (err) {
        throw err;
    }
    console.log("The weather in New York is " + result.toLowerCase());
    queue.close(true);
});