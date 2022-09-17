import express from 'express'
const router = express.Router()

import isAuth from '../middleware/isAuth.js'

import { searchController } from '../controllers/searchController.js'

router.get('/search/:query', searchController)

export default router
