// backend/pametni-paketnik/routes/mailboxRoutes.js
var express = require('express');
var router = express.Router();
var mailboxController = require('../controllers/mailboxController.js');
var isAuthenticated = require('../middleware/authMiddleware.js');

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
//router.post('/', isAuthenticated, mailboxController.create);

/*
 * PUT
 */
router.put('/:id', isAuthenticated, mailboxController.update);

/*
 * DELETE
 */
router.delete('/:id', isAuthenticated, mailboxController.remove);


router.post('/addMailbox', mailboxController.create);


module.exports = router;
