const
    moment = require('moment-timezone'),
    logger = require('../utils/logger'),
    User = require('../models/userModel.js'),
    jwt = require('jsonwebtoken'),
    validator = require("email-validator");

let serverError = {error: 'Internal server error'};

module.exports = {

    get (req, callback) {
        User.findOne({"Token": req.headers['token']}, 
        'FirstName LastName Countries Categories', 
        (err, user) => {
            if (err){
                logger.error(err);
                callback(serverError, null);
            } 
            if (user) {
               callback(null, user)
            } else {
                callback({'message': 'User was not found', 'code': 403})
            }
        })
    },

    create (req, callback) {
        req.body.Email = req.body.Email.toLowerCase();
        let valid = validator.validate(req.body.Email);
        if(!valid){
            callback({'message': 'email address invalid', 'code': 400});
        } else {
            User.findOne({'Email': req.body.Email}, (err, user) => {
                if (err) {
                    logger.error(err);
                    callback(serverError, null);
                }
                if (user){
                    callback({'message': 'user already exist', 'code': 202});
                } else {
                    let user = new User(req.body); 
                    let token = jwt.sign({user}, 'my_secret_key');
                    user.Token = token;
                    user.CreatedAt = new Date();
                    user.save((err, user) => {
                        if (err) {
                            logger.error(err);
                            callback(serverError, null);
                        } else {
                            callback(null, {'token': user.Token, 'code': 200});
                        }
                    });
                }
            })
        }
    },

    login(req, callback) {
        let user = req.body;
        User.findOne({"Email": user.Email}, (err, user) => {
            if (err) {
                logger.error(err);
                callback(serverError)
            }
            if (user) {
                let result = user.checkPassword(user.password);
                if (result) {
                    let token = jwt.sign({user}, 'my_secret_key');
                    user.Token = token;
                    user.save((err, user) => {
                        if (err){
                            logger.error(err);
                            callback(serverError, null);
                        }else {
                            callback(null, {'token': user.Token, 'code': 200});
                        }
                    })
                } else {
                    callback({'message': 'wrong password', 'code': 403})
                }
            } else {
                callback({'message': 'User was not found', 'code': 403})
            }
        });
    },

    logout (req, callback) {
        User.findOne({"Token": req.headers['token']}, (err, user) => {
            if (err){
                logger.error(err);
                callback(serverError, null);
            } 
            if (user) {
                user.Token = null;
                user.save((err, user) => {
                    if (err){
                        logger.error(err);
                        callback(serverError, null);
                    }else {
                        callback(null, {statusCode: 204});
                    }
                })
            } else {
                callback({'message': 'User was not found', 'code': 403})
            }
        })
    },

    update(req, callback) {
        User.update({"Token": req.headers['token']}, {$set: req.body}, (err, user) => {
            if (err){
                logger.error(err);
                callback(serverError, null);
            } 
            if (user) {
                callback(null, {statusCode: 204});
            } else {
                callback({'message': 'User was not found', 'code': 403})
            }
        })
    }
}