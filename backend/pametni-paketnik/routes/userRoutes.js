var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

router.get('/', userController.list);
router.get('/profile', userController.profile);
//router.get('/login', userController.renderLogin); //vrstni red pomemben (login pred show --> ker rabi user_id)
router.get('/:id', userController.show);
router.post('/', userController.create);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/:id', userController.update);
router.post('/change-password', userController.changePassword);
router.delete('/:id', userController.remove);




module.exports = router;
