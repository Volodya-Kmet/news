const
    logger = require('../utils/logger'),
    User = require('../models/userModel.js'),
    validator = require("email-validator");

let serverError = {error: 'Internal server error'};

module.exports = {

    getUser(req, callback) {
        let token = req.headers['token'];
        User.findOne({"Token": token},
            'FirstName LastName Country Categories Salt',
            (err, foundUser) => {
                if (err) {
                    logger.error(err);
                    callback(serverError, null);
                }
                if (foundUser) {
                    let verifyed = foundUser.verifyToken(token, foundUser.Salt);
                    verifyed.then(response => {
                        if (response) {
                            let user = {
                                FirstName: foundUser.FirstName,
                                LastName: foundUser.LastName,
                                Country: foundUser.Country,
                                Categories: foundUser.Categories
                            };
                            callback(null, {code: 200, response: {user}})
                        } else {
                            callback({code: 403, error: 'Token expired'})
                        }
                    })
                } else {
                    callback({error: 'User was not found', code: 403})
                }
            })
    },

    refresh(req, callback) {
        let token = req.headers['token'];
        User.findOne({"Token": token}, 'Salt', (err, user) => {
            if (err) {
                logger.error(err);
                callback(serverError, null);
            }
            if (user) {
                let verifyed = user.verifyToken(token, user.Salt);
                if (verifyed) {
                    user.createToken();
                    user.save((err, user) => {
                        if (err) {
                            logger.error(err);
                            callback(serverError, null);
                        } else {
                            callback(null, {response: {'token': user.Token}, code: 200});
                        }
                    });
                } else {
                    callback({error: 'Token expired', code: 403})
                }
            } else {
                callback({error: 'User does not exist', code: 403})
            }
        })
    },

    create(req, callback) {
        req.body.Email = req.body.Email.toLowerCase();
        let valid = validator.validate(req.body.Email);
        if (!valid) {
            callback({error: 'email address invalid', code: 400});
        } else {
            User.findOne({'Email': req.body.Email}, (err, user) => {
                if (err) {
                    logger.error(err);
                    callback(serverError, null);
                }
                if (user) {
                    callback({error: 'user already exist', code: 400}, null);
                } else {
                    let user = new User(req.body);
                    user.createToken();
                    user.save((err, user) => {
                        if (err) {
                            logger.error(err);
                            callback(serverError, null);
                        } else {
                            callback(null, {response: {'token': user.Token}, code: 200});
                        }
                    });
                }
            })
        }
    },

    login(req, callback) {
        let user = req.body;
        User.findOne({"Email": user.Email.toLowerCase()}, (err, user) => {
            if (err) {
                logger.error(err);
                callback(serverError)
            }
            if (user) {
                user.checkPassword(req.body.Password)
                    .then(result => {
                            if (result) {
                                user.createToken();
                                user.save((err, user) => {
                                    if (err) {
                                        logger.error(err);
                                        callback(serverError, null);
                                    } else {
                                        callback(null, {response: {'token': user.Token}, 'code': 200});
                                    }
                                })
                            } else {
                                callback({error: 'wrong password', code: 403})
                            }
                        },
                        rej => callback(serverError)
                    )
            } else {
                callback({error: 'User was not found', code: 403})
            }
        });
    },

    logout(req, callback) {
        User.findOne({"Token": req.headers['token']}, (err, user) => {
            if (err) {
                logger.error(err);
                callback(serverError, null);
            }
            if (user) {
                user.Token = null;
                user.save((err, user) => {
                    if (err) {
                        logger.error(err);
                        callback(serverError, null);
                    } else {
                        callback(null, {'code': 204});
                    }
                })
            } else {
                callback({'message': 'User was not found', 'code': 403})
            }
        })
    },

    update(req, callback) {
        User.findOne({"Token": req.headers['token']}, (err, user) => {
            if (err) {
                logger.error(err);
                callback(serverError, null);
            }
            if (user) {
                if (req.body.NewPassword) {
                    user.checkPassword(req.body.Password)
                        .then(result => {
                            if (result) {
                                req.body.Password = req.body.NewPassword;
                                   this.updatePass(req, user)
                                    .then(user => this.saveUpdates(req))
                                    .then(response => callback(null, {response: {'token': user.Token}, 'code': 200}))
                                    .catch(err => callback(err, null))
                            } else {
                                callback({error: 'Wrong Password', code: 400}, null)
                            }
                        })
                } else {
                        this.saveUpdates(req)
                        .then(response => {
                            callback(null, {response: {'token': user.Token}, 'code': 200})
                        })
                        .catch(err => callback(err, null))
                }
            } else {
                callback({'message': 'User was not found', 'code': 403})
            }
        })
    },

    updatePass(req, user) {
        return new Promise((resolve, reject) => {
            user.Password = req.body.NewPassword;
            user.createToken();
            user.save((err, user) => {
                if (err) {
                    logger.error(err);
                    reject(serverError);
                } else {
                    resolve(user);
                }
            })
        })
    },

    saveUpdates(req) {
        return new Promise((resolve, rej) => {
            User.update({"Token": req.headers['token']}, {$set: req.body}, (err, response) => {
                if (err) {
                    logger.error(err);
                    rej(serverError);
                }
                if (response) {
                    resolve({'code': 200});
                } else {
                    rej({'message': 'User was not found', 'code': 403})
                }
            })
        })
    }
};