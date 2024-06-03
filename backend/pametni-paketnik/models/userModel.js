import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  'username': String,
  'password': String,
  'email': String,
});

userSchema.pre('save', function(next) {
  const user = this;
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

const User = mongoose.model('user', userSchema);
export default User;