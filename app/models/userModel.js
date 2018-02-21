const bcrypt = require('bcryptjs'),
    mongoose = require('mongoose'),
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
    Email:  {
        type: String,
        unique: true,
        required: true
    },
    CreatedAt:  {
        type: Date,
        required: true
    },
    Countries: {
        type: String,
        required: true
    },
    Categories: {
        type: Array
    },
    Token: {
        type: String,
    }
  });

UserSchema.virtual('Password')
    .set(function (Password) {
        let salt = bcrypt.genSaltSync(10);
        this.HashedPassword = bcrypt.hashSync(Password, salt);;
    });

UserSchema.methods.checkPassword = function (Password) {
    return bcrypt.compare(Password, this.HashedPassword)
};

module.exports = mongoose.model('users', UserSchema);