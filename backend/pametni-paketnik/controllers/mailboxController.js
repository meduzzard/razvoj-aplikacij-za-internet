// backend/pametni-paketnik/controllers/mailboxController.js
var MailboxModel = require('../models/mailboxModel.js');

/**
 * mailboxController.js
 *
 * @description :: Server-side logic for managing mailboxs.
 */
module.exports = {

    /**
     * mailboxController.list()
     */
    list: function (req, res) {
        MailboxModel.find(function (err, mailboxs) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting mailbox.',
                    error: err
                });
            }

            return res.json(mailboxs);
        });
    },

    /**
     * mailboxController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        MailboxModel.findOne({_id: id}, function (err, mailbox) {
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
    /**
     * mailboxController.create()
     */
    create: async function (req, res) {
        try {
            var mailbox = new MailboxModel({
                owner: 'tbd', // Set owner as 'tbd'
                last_opened: new Date()
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
    update: function (req, res) {
        var id = req.params.id;

        MailboxModel.findOne({_id: id}, function (err, mailbox) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting mailbox',
                    error: err
                });
            }

            if (!mailbox) {
                return res.status(404).json({
                    message: 'No such mailbox'
                });
            }

            mailbox.owner = req.body.owner ? req.body.owner : mailbox.owner;
            mailbox.last_opened = req.body.last_opened ? req.body.last_opened : mailbox.last_opened;

            mailbox.save(function (err, mailbox) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating mailbox.',
                        error: err
                    });
                }

                return res.json(mailbox);
            });
        });
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
    }
};
