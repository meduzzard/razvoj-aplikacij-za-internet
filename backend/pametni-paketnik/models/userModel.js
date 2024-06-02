var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    'username': String,
    'password': String,
    'email': String,
    'faceImages': [String]  // Add this line to store image paths
});

userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

userSchema.statics.authenticate = async function(username, password) {
    const user = await this.findOne({ username }).exec();
    if (!user) {
        throw new Error('User not found');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error('Password mismatch');
    }
    return user;
}

var User = mongoose.model('user', userSchema);
module.exports = User;
