import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.get('/', userController.list);
router.get('/profile', userController.profile);
// router.get('/login', userController.renderLogin); //vrstni red pomemben (login pred show --> ker rabi user_id)
router.get('/:id', userController.show);
router.post('/', userController.create);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/:id', userController.update);
router.post('/change-password', userController.changePassword);
router.delete('/:id', userController.remove);

export default router;
