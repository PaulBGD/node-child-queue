var fork = require("child_process").fork;

/**
 * Creates and manages a forked child_process
 * This is not a queue, it will ignore inputs when it is busy
 * @param file the source file to fork
 * @param queue the Queue instance
 * @param available the function to call when the process is available
 * @constructor
 */
function Process(file, queue, available) {
    var $this = this;
    this.file = file;
    this.queue = queue;
    this.available = available;
    this.process = fork(require.resolve("./handler.js"));
    this.busy = false;

    this.process.on('message', function (message) {
        $this.callback(message.error, message.output);
        $this.callback = undefined;
        $this.busy = false;
        $this.available($this.queue);
    });
}

/**
 * Sends an input to this process
 * @param input the input to process
 * @param callback the callback to call when the input is process
 * @throws Error if the input is not an object or the callback is not a function
 */
Process.prototype.add = function (input, callback) {
    if (this.busy) {
        return;
    }
    this.process.send({
        file: this.file,
        input: input
    });
    this.callback = callback;
    this.busy = true;
};

/**
 * Attempts to close this process
 * @param force whether to force close it
 */
Process.prototype.close = function (force) {
    if (force) {
        this.process.kill();
    } else {
        this.process.send('exit');
    }
};

module.exports = Process;