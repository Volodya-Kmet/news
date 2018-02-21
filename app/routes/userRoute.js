const express = require('express'),
    router = express.Router(),
    UserService = require('../services/UserService');

module.exports = router;

router.get('/get', (req, res) => {
    UserService.get(req, (err, data) => {
        sendResponse(res, err, data);
    })
});
router.post('/create', (req, res) => {
    UserService.create(req, (err, data) => {
        sendResponse(res, err, data);
    })
});
router.post('/login', (req, res) => {
    UserService.login(req, (err, data) => {
        sendResponse(res, err, data);
    })
});
router.put('/logout', (req, res) => {
    UserService.logout(req, (err, data) => {
        sendResponse(res, err, data);
    })
});
router.put('/update', (req, res) => {
    UserService.update(req, (err, data) => {
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