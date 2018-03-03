const bcrypt = require('bcryptjs'),
    mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    Schema = mongoose.Schema;

let UserSchema = new Schema({
    HashedPassword: {
        type: String,
        required: true,
    },
    FirstName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        unique: true,
        required: true
    },
    CreatedDate: {
        type: Date,
        required: true,
        default: new Date
    },
    Country: {
        type: String,
        required: true
    },
    Categories: {
        type: Array
    },
    Token: {
        type: String,
    },
    Salt: {
        type: String
    }
});

UserSchema.virtual('Password')
    .set(function (Password) {
        this.Salt = bcrypt.genSaltSync(10);
        this.HashedPassword = bcrypt.hashSync(Password, this.Salt);
    });

UserSchema.methods.checkPassword = function (Password) {
    return bcrypt.compare(Password, this.HashedPassword)
};

UserSchema.methods.createToken = function () {
    this.Token = jwt.sign({}, this.Salt, {expiresIn: '2d', algorithm: 'HS256'});
};

UserSchema.methods.verifyToken = function (token, salt) {
    return new Promise((resolv, rej) => {
        jwt.verify(token, salt, {algorithms: 'HS256'},  function (err, decoded) {
            if (err) {
                resolv(false)
            } else {
                resolv(true)
            }
        })
    })
};

module.exports = mongoose.model('users', UserSchema);