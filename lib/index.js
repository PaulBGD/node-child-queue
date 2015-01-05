var utils = require("./utils");
var fs = require("fs");

var Process = require("./process");

/** The default options */
var defaults = {
    maxProcesses: 5,
    preLoadChildren: false,
    allowOverflow: true
};

/**
 * Queues inputs for each of the processes
 * @param options the options for the queue
 * @param path the path to the source file which handles input
 * @constructor
 */
function Queue(options, path) {
    if (typeof options == 'string') {
        path = options;
        options = utils.copyObject(defaults);
    } else {
        utils.mergeObject(options, defaults);
    }
    if (!fs.existsSync(path)) {
        throw new Error("Missing file '" + path + "'");
    }
    this.options = options;
    this.path = path;

    this.processes = [];
    this.globalQueue = [];
    if (options.preLoadChildren) {
        for (var i = 0; i < options.maxProcesses; i++) {
            this.createProcess();
        }
    }
}

Queue.prototype = (function () {
    /**
     * Finds an open process if available and creates a new one if needed
     * @param $this the queue instance
     * @returns the process if found, otherwise undefined
     */
    var findOpenProcess = function ($this) {
        var process = utils.each($this.processes, function (index, process) {
            if (!process.busy) {
                return process;
            }
        });
        if (!process && $this.processes.length < $this.options.maxProcesses) {
            process = this.createProcess($this);
        }
        return process;
    };
    /**
     * Called when allowOverflow is true and a process is finished. Handles the next item
     * @param $this the queue instance
     */
    var available = function ($this) {
        if ($this.options.allowOverflow && $this.processes.length > 0) {
            var process = findOpenProcess($this);
            if (process != undefined) {
                var request = $this.processes.shift();
                process.add(request.input, request.callback);
            }
        }
    };
    return {
        constructor: Queue,
        /**
         * Requests a process to handle said input
         * @param input the input for the process to handle
         * @param callback the function to callback when the input is handled
         */
        request: function (input, callback) {
            var process = findOpenProcess(this);
            if (process) {
                process.add(input, callback);
            } else {
                if (this.options.allowOverflow) {
                    this.globalQueue.push({
                        input: input,
                        callback: callback
                    });
                }
            }
        },
        /**
         * Creates a new process, even if we are over the maxProcesses limit
         * @returns {Process}
         */
        createProcess: function () {
            var process = new Process(this.path, this, available);
            this.processes.push(process);
            return process;
        }
    }
})();

module.exports = Queue;