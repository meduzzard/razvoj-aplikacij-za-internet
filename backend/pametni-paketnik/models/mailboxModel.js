import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const mailboxSchema = new Schema({
  // Define your schema fields here
  name: String,
  location: String,
  status: String
});

const Mailbox = mongoose.model('mailbox', mailboxSchema);

export default Mailbox;