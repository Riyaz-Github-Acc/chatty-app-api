import express from 'express'

import { checkAuth, login, logout, signup, updateProfile } from '@/controllers/auth.controller';
import { protectedRoute } from '@/middlewares/auth.middleware';

const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

router.patch('/profile-pic', protectedRoute, updateProfile)

router.get('/me', protectedRoute, checkAuth)

export default router;