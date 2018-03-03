const express = require('express'),
    router = express.Router(),
    UserService = require('../services/UserService');

module.exports = router;

router.get('/getUser', (req, res) => {
    UserService.getUser(req, (err, data) => {
        sendResponse(res, err, data);
    })
});

router.post('/register', (req, res) => {
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
router.put('/refreshToken', (req, res) => {
    UserService.refresh(req, (err, data) => {
        sendResponse(res, err, data);
    })
});
router.put('/updateUser', (req, res) => {
    UserService.update(req, (err, data) => {
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