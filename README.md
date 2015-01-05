# Node Child Queue

Allow complex tasks to be queued and processed by child processes to speed up your Node application.

## Examples

*main.js*
```js
var Queue = require("../../");
var queue = new Queue(require.resolve("./child"));
queue.request({type: "weather", area: "New York"}, function(err, result) {
    if (err) {
        throw err;
    }
    console.log("The weather in New York is " + result.toLowerCase());
    queue.close(true);
});
```

*child.js*
```js
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
```

## API

The included API is quite simple to understand

### `new Queue([options, ]pathToChild)`

Creates a new queue to handle processes. The pathToChild should be *relative*.

### `options`

If you don't supply an options object, the following will be used

```js
{
    maxProcesses: 5,
    preLoadChildren: false,
    allowOverflow: true
}
```

* `maxProcesses` the most child processes you want running at a single time
* `preLoadChildren` when set, the child processes will be created before giving an input
* `allowOverflow` allows you to give an input even when all processes are busy. It will be inputted whenever a process is ready