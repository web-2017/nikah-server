import express from 'express'
const router = express.Router()

import isAuth from '../middleware/isAuth.js'

import {
	editProfile,
	createProfile,
	getProfile,
	allProfiles,
} from '../controllers/profileController.js'

router
	.get('/profile/:userId', isAuth, getProfile)
	.get('/profiles', allProfiles)
	.post('/profile', isAuth, createProfile)
	.put('/profile', isAuth, editProfile)

router.param('id', (req, res, next, id) => {
	console.log(id)
	next()
})

export default router
