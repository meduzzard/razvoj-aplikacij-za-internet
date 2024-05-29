import express from 'express';
import mailboxController from '../controllers/mailboxController.js';
import isAuthenticated from '../middleware/authMiddleware.js';

const router = express.Router();

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

export default router;
