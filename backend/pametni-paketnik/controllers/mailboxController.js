import MailboxModel from '../models/mailboxModel.js';

const mailboxController = {
  list: function (req, res) {
    MailboxModel.find(function (err, mailboxes) {
      if (err) {
        return res.status(500).json({
          message: 'Error when getting mailboxes.',
          error: err
        });
      }

      return res.json(mailboxes);
    });
  },

  show: async function (req, res) {
    const id = req.params.id;
    try {
      const mailbox = await MailboxModel.findOne({ _id: id }).exec();
      if (!mailbox) {
        return res.status(404).json({ message: 'No such mailbox' });
      }
      res.json(mailbox);
    } catch (err) {
      res.status(500).json({
        message: 'Error when getting mailbox.',
        error: err
      });
    }
  },

  create: function (req, res) {
    const mailbox = new MailboxModel({
      // Add your mailbox fields here
    });

    mailbox.save(function (err, mailbox) {
      if (err) {
        return res.status(500).json({
          message: 'Error when creating mailbox',
          error: err
        });
      }

      return res.status(201).json(mailbox);
    });
  },

  update: function (req, res) {
    const id = req.params.id;

    MailboxModel.findOne({ _id: id }, function (err, mailbox) {
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

      // Update your mailbox fields here

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

  remove: function (req, res) {
    const id = req.params.id;

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
    const id = req.params.id;

    try {
      const mailbox = await MailboxModel.findOne({ _id: id }).exec();
      if (!mailbox) {
        return res.status(404).json({ message: 'No such mailbox' });
      }

      // Logic for unlocking the mailbox goes here

      await mailbox.save();
      return res.json(mailbox);
    } catch (err) {
      return res.status(500).json({
        message: 'Error when unlocking the mailbox.',
        error: err
      });
    }
  }
};

export default mailboxController;
