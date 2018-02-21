const
    logger = require('../utils/logger'),
    User = require('../models/userModel.js'),
    NewsAPI = require('newsapi'),
    newsapi = new NewsAPI('27c459eea11f4adc852261ed2f4cb121');

let serverError = {error: 'Internal server error'};

module.exports = {
    getTopHeadlines () {
        console.log('hi')
    }
}