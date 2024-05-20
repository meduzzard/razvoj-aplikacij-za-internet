var MailboxModel = require('../models/mailboxModel.js');
var UserModel = require('../models/userModel.js');

/**
 * mailboxController.js
 *
 * @description :: Server-side logic for managing mailboxes.
 */
module.exports = {

    /**
     * mailboxController.list()
     */
    list: async function (req, res) {
        console.log('Fetching mailboxes...');
        try {
            const mailboxes = await MailboxModel.find(); // Use await here
            console.log('Mailboxes fetched successfully:', mailboxes);
            return res.json(mailboxes);
        } catch (err) {
            console.error('Error when getting mailboxes:', err); // Log the error
            return res.status(500).json({
                message: 'Error when getting mailboxes.',
                error: err
            });
        }
    },
    

    /**
     * mailboxController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        MailboxModel.findOne({ _id: id }, function (err, mailbox) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting mailbox.',
                    error: err
                });
            }

            if (!mailbox) {
                return res.status(404).json({
                    message: 'No such mailbox'
                });
            }

            return res.json(mailbox);
        });
    },

    /**
     * mailboxController.create()
     */
    create: async function (req, res) {
        try {
            var userId = req.session.userId; // Get the userId from the session
            if (!userId) {
                return res.status(401).json({
                    message: 'Unauthorized: No user logged in'
                });
            }
    
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }
    
            var mailbox = new MailboxModel({
                owner: user.username, // Store the username directly
                last_opened: null 
            });
    
            const savedMailbox = await mailbox.save(); // Save the mailbox
    
            return res.status(201).json(savedMailbox);
        } catch (error) {
            return res.status(500).json({
                message: 'Error when creating mailbox',
                error: error.message
            });
        }
    },
    
    /**
     * mailboxController.update()
     */
    update: async function (req, res) {
        var id = req.params.id;
    
        try {
            const mailbox = await MailboxModel.findById(id);
            if (!mailbox) {
                return res.status(404).json({
                    message: 'No such mailbox'
                });
            }
    
            if (req.body.owner) {
                const user = await UserModel.findById(req.body.owner);
                if (!user) {
                    return res.status(404).json({
                        message: 'User not found'
                    });
                }
                mailbox.owner = user.username; // Update the owner to the username
            }
    
            mailbox.last_opened = req.body.last_opened ? req.body.last_opened : mailbox.last_opened;
    
            const updatedMailbox = await mailbox.save();
            return res.json(updatedMailbox);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when updating mailbox.',
                error: err
            });
        }
    },    

    /**
     * mailboxController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        MailboxModel.findByIdAndRemove(id, function (err, mailbox) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the mailbox.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    unlock: async function (req, res) {
        var id = req.params.id;

        try {
            const mailbox = await MailboxModel.findById(id);
            if (!mailbox) {
                return res.status(404).json({
                    message: 'No such mailbox'
                });
            }

            const userId = req.session.userId; // Get the userId from the session
            if (!userId) {
                return res.status(401).json({
                    message: 'Unauthorized: No user logged in'
                });
            }

            const currentDate = new Date();

            mailbox.last_opened = currentDate;
            mailbox.unlock_history.push({
                user: userId,
                timestamp: currentDate
            });

            const updatedMailbox = await mailbox.save();
            return res.json(updatedMailbox);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when unlocking the mailbox.',
                error: err
            });
        }
    },
};