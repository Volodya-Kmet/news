const config = require('./app/config'),
    express = require('express'),
    app = express(),
    logger = require('./app/utils/logger'),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    bodyParser = require('body-parser'),

    userRoute = require('./app/routes/userRoute'),
    newsRoute = require('./app/routes/newsRoute'),
    path = require('path');

    mongoose.Promise = global.Promise;
    
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, 'public')));
    
// REGISTER ROUTES
// =======================================================
app.use('/user', userRoute);
app.use('/news', newsRoute);

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