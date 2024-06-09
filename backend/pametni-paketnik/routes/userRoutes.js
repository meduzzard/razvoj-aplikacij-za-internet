var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');
const multer = require('multer');
const upload = multer();
const isAuthenticated = require('../middleware/authMiddleware'); // Import the middleware

router.get('/', userController.list);
router.get('/profile', isAuthenticated, userController.profile); // Protect the profile route
router.get('/:id', userController.show);
router.post('/', userController.create);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/check-verification-result', userController.checkVerificationResult);
router.put('/:id', userController.update);
router.post('/change-password', isAuthenticated, userController.changePassword); // Protect change password route
router.delete('/:id', userController.remove);
router.post('/saveFaceImages', upload.any(), userController.saveFaceImages);
router.post('/verifyFaceImage', upload.any(), userController.verifyFaceImage);
router.post('/launch-login', userController.launchLogin);

module.exports = router;