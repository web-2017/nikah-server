import express from 'express'
const router = express.Router()

import isAuth from '../middleware/isAuth.js'

import {
	updateUserController,
	userController,
	allUsersController,
} from '../controllers/userController.js'

router
	.get('/user/:id', isAuth, userController)
	.get('/users', isAuth, allUsersController)
	.put('/user', isAuth, updateUserController)

export default router
