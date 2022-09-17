import express from 'express'
const router = express.Router()

import isAuth from '../middleware/isAuth.js'

import {
	signUp,
	protectedVerification,
	signIn,
	resetPassword,
	setNewPassword,
} from '../controllers/authController.js'

router
	.get('/protected', isAuth, protectedVerification)
	.post('/signup', signUp)
	.post('/signin', signIn)
	.post('/reset-password', resetPassword)
	.post('/new-password', setNewPassword)

export default router
