process.on('message', function (data) {
    if (data == 'exit') {
        process.exit(0);
    } else {
        try {
            require(data.file)(data.input, function (error, output) {
                process.send({
                    error: error,
                    output: output
                });
            });
        } catch (err) {
            process.send({
                error: err
            });
        }
    }
});