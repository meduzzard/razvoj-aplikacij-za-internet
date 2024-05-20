const express = require('express');
const router = express.Router();
const mailboxController = require('../controllers/mailboxController.js');
const isAuthenticated = require('../middleware/authMiddleware.js');

/*
 * GET
 */
router.get('/', mailboxController.list);

/*
 * GET
 */
router.get('/:id', mailboxController.show);

/*
 * POST
 */
router.post('/addMailbox', isAuthenticated, mailboxController.create);

/*
 * PUT
 */
router.put('/:id', isAuthenticated, mailboxController.update);

/*
 * DELETE
 */
router.delete('/:id', isAuthenticated, mailboxController.remove);

/*
 * PUT - Unlock mailbox
 */
router.put('/unlockMailbox/:id', isAuthenticated, mailboxController.unlock);

module.exports = router;
