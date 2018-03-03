const express = require('express'),
    router = express.Router(),
    NewsService = require('../services/NewsService');

module.exports = router;

router.put('/getNews', (req, res) => {
    NewsService.getNews(req, (err, data) => {
        sendResponse(res, err, data);
    })
});

function sendResponse(res, err, responseObject) {
    if (err) {
        res.status(err.code).send(err.error);
    } else {
        res.status(responseObject.code).send(responseObject.response);
    }
}

    