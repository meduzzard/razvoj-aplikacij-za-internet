var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const mailboxSchema = new Schema({
    owner: { type: String, required: true }, // Ensure owner is required
    last_opened: { type: Date, default: null },
    unlock_history: [{
        user: { type: Schema.Types.ObjectId, ref: 'user' },
        timestamp: Date
    }]
});

module.exports = mongoose.model('mailbox', mailboxSchema);
