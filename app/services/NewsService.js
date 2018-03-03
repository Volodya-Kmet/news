const
    logger = require('../utils/logger'),
    config = require('../config'),
    NewsAPI = require('newsapi'),
    newsapi = new NewsAPI(config.API.key),
    User = require('../models/userModel.js');

let serverError = {error: 'Internal server error'};

module.exports = {
    getNews(req, callback) {
        let options = {};
        let titleNews = req.headers['title'];
        let token = req.headers['token'];
        console.log(token)
        User.findOne({'Token': token}, 'Country Categories', (err, user) => {
            if (err) {

                console.log('err')
                logger.error(err);
                callback(serverError)
            }
            if (user) {

                console.log(user)
                options.country = user.Country;
                options.category = titleNews != 'Top' ? user.Categories : null;

                newsapi.v2.topHeadlines(options)
                    .then(response => callback(null, {code: 200, response: response}),
                        err => {
                            logger.error(err);
                            callback(serverError)
                        })

            } else {

                console.log('nf')
                callback({error: 'User was not found', code: 403})
            }
        })
    }
};