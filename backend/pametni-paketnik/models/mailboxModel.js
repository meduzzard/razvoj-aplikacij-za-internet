var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var mailboxSchema = new Schema({
	'owner' : String,
	'last_opened' : Date
});

module.exports = mongoose.model('mailbox', mailboxSchema);
