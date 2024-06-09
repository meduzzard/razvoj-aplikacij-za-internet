// backend/routes/mailboxRoutes.js

const express = require('express');
const router = express.Router();
const mailboxController = require('../controllers/mailboxController.js');
const isAuthenticated = require('../middleware/authMiddleware.js');

router.get('/', mailboxController.list);
router.get('/:id', mailboxController.show);
router.post('/addMailbox', isAuthenticated, mailboxController.create);
router.put('/:id', isAuthenticated, mailboxController.update);
router.delete('/:id', isAuthenticated, mailboxController.remove);
router.put('/unlockMailbox/:id', isAuthenticated, mailboxController.unlock);
router.get('/unlockHistory/:id', isAuthenticated, mailboxController.unlockHistory); // Dodajte novo pot za pridobivanje zgodovine odklepanja

module.exports = router;
