import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/keys.js'
import User from '../models/userModel.js'

export default async (req, res, next) => {
	const { authorization } = req.headers
	if (!authorization) {
		return res.status(401).json({ error: 'you must be logged in' })
	}

	const token = authorization.replace('Bearer ', '')
	try {
		const verified = await jwt.verify(token, JWT_SECRET)
		if (!verified) {
			return res.status(401).json({ error: 'you must be logged in' })
		}

		req.user = await User.findById(verified.id)
		next()
	} catch (e) {
		console.error(e)
	}
}
