var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');
const multer = require('multer');
const upload = multer();

router.get('/', userController.list);
router.get('/profile', userController.profile);
router.get('/:id', userController.show);
router.post('/', userController.create);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/:id', userController.update);
router.post('/change-password', userController.changePassword);
router.delete('/:id', userController.remove);

// Add this line for saveFaceImages
router.post('/saveFaceImages', upload.any(), userController.saveFaceImages);

module.exports = router;