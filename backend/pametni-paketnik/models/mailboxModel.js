var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MailboxSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    last_opened: { type: Date, default: null },
    unlock_history: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Mailbox', MailboxSchema);
