var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mailboxSchema = new Schema({
    owner: String, // Change to String to store the username directly
    last_opened: Date,
    unlock_history: [{
        user: { type: Schema.Types.ObjectId, ref: 'user' },
        timestamp: Date
    }]
});

module.exports = mongoose.model('mailbox', mailboxSchema);
