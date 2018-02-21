const express = require('express'),
    router = express.Router(),
    NewsService = require('../services/NewsService');

module.exports = router;

router.get('/getTopHeadlines', (req, res) => {
    console.log(req.body)
    NewsService.getTopHeadlines(req, (err, data) => {
        sendResponse(res, err, data);
    })
});

function sendResponse(res, err, responseObject) {
    if (err) {
        res.send(err);
    } else {
        res.send(responseObject);
    }
}

    