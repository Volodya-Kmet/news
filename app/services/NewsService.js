const
    logger = require('../utils/logger'),
    config = require('../config'),
    NewsAPI = require('newsapi'),
    newsapi = new NewsAPI(config.API.key),
    User = require('../models/userModel.js');

let serverError = {error: 'Internal server error'};

module.exports = {
    getNews(req, callback) {
        let title = req.headers['title'];
        let token = req.headers['token'];
        let options = {};
        User.findOne({'Token': token}, 'Country Categories', (err, user) => {
            if (err) {
                logger.error(err);
                callback(serverError)
            }
            if (user) {
                options.country = user.Country;
                options.category = title != 'Top' ? user.Categories : null;
                newsapi.v2.topHeadlines(options)
                    .then(
                        response => {
                            console.log(response);
                            callback(null, {code: 200, response: response})
                        },
                        err => {
                            logger.error(err);
                            callback(serverError)
                        })
            }
        })
    }
};