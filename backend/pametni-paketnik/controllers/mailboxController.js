var MailboxModel = require('../models/mailboxModel.js');
var UserModel = require('../models/userModel.js');
const { exec } = require('child_process');
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
            const userId = req.session.userId; // Get the userId from the session
            if (!userId) {
                return res.status(401).json({
                    message: 'Unauthorized: No user logged in'
                });
            }
            const mailboxes = await MailboxModel.find({ owner: userId }); // Filter by user ID
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
            const userId = req.session.userId;
            if (!userId) {
                return res.status(401).json({
                    message: 'Unauthorized: No user logged in'
                });
            }

            const { latitude, longitude } = req.body;

            var mailbox = new MailboxModel({
                owner: userId,
                latitude: latitude,
                longitude: longitude,
                last_opened: null
            });

            const savedMailbox = await mailbox.save();
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

        // Execute the BAT file to open the Android activity
        exec('launch_activity.bat', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing BAT file: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`BAT file stderr: ${stderr}`);
                return;
            }
            console.log(`BAT file stdout: ${stdout}`);
        });

        exec('launch_activity.bat', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing BAT file: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`BAT file stderr: ${stderr}`);
                return;
            }
            console.log(`BAT file stdout: ${stdout}`);
        });

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

    unlockHistory: async function (req, res) {
        var id = req.params.id;

        try {
            const mailbox = await MailboxModel.findById(id);
            if (!mailbox) {
                return res.status(404).json({
                    message: 'No such mailbox'
                });
            }

            const unlockHistory = mailbox.unlock_history; // Pridobimo zgodovino odklepanja

            return res.json(unlockHistory);
        } catch (err) {
            return res.status(500).json({
                message: 'Error when getting unlock history.',
                error: err
            });
        }
    },
};