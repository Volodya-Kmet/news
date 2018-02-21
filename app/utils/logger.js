let winston = require('winston');
require('winston-daily-rotate-file');

let logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({level: 'debug'}),

        new (winston.transports.DailyRotateFile)({
            filename: './log',
            datePattern: 'yyyy-MM-dd.',
            prepend: true,
            level: 'debug',
            handleExceptions: true,
            maxFiles: 15
        })
    ]
});

module.exports = logger;