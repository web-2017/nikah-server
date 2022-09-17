import express from 'express'
const router = express.Router()

import isAuth from '../middleware/isAuth.js'

import {
	updateUserController,
	userController,
} from '../controllers/userController.js'

router
	.get('/user/:id', isAuth, userController)
	.put('/user', isAuth, updateUserController)

export default router
