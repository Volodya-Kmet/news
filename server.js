const config = require('./app/config'),
    logger = require('./app/utils/logger'),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    app = require('./app');

mongoose.Promise = global.Promise;

// START THE SERVER
// =======================================================
app.listen(config.server.port);
logger.info('================Server=====================');
logger.info(' host : ' + config.server.host);
logger.info(' port : ' + config.server.port);

// DATABASE SETUP
// =======================================================
db.on('error', logger.error);
db.once('open', () => {
    logger.info(' Success connected to DB!');
    logger.info('===========================================');
});

let promis = mongoose.connect('mongodb://' + config.database.host + ':' +
    config.database.port + '/' + config.database.db);

logger.info('================Database===================');
logger.info(' name : ' + mongoose.connection.name);
logger.info(' host : ' + mongoose.connection.host);
logger.info(' port : ' + mongoose.connection.port);