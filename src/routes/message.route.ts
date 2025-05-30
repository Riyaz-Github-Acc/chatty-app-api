import express from 'express'

import { getMessages, getUsersForSidebar, postMessage } from '@/controllers/message.controller';
import { protectedRoute } from '@/middlewares/auth.middleware';

const router = express.Router();

router.get('/users', protectedRoute, getUsersForSidebar);
router.get('/:chatUserId', protectedRoute, getMessages);

router.post('/:receiverId', protectedRoute, postMessage);

export default router;