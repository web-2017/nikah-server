import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import 'colors'

// components
import User from '../models/userModel.js'
import { JWT_SECRET } from '../config/keys.js'

export const protectedVerification = (req, res) => {
	res.json('router protected')
}

export const signUp = async (req, res) => {
	const { firstName, lastName, password, email, phone } = req.body

	if (!firstName || !password || !lastName || !phone) {
		return res.status(422).json({ message: 'All fields are required!' })
	}

	if (password.length < 5) {
		return res
			.status(422)
			.json({ message: 'password must be at least 6 characters!' })
	}

	try {
		const checkUser = await User.findOne({ email: email })

		if (checkUser)
			return res.status(422).json({ message: `User already exist` })

		const hashPassword = await bcrypt.hash(req.body.password, 12)

		const user = new User({
			...req.body,
			uniqUserId: Date.now(),
			password: hashPassword,
		})

		await user.save()
		console.log(`User ${req.body.email} is created`)
		return res.json({
			message: `User created success ${firstName} ${lastName}`,
		})
	} catch (e) {
		console.log(e)
	}
}

export const signIn = async (req, res) => {
	const { email, password } = req.body

	if (!email || !password) {
		return res.status(422).json({ message: 'Email and password are required' })
	}

	const user = await User.findOne({ email: email })

	if (!user) {
		return res
			.status(422)
			.json({ message: `User with this email does not exist` })
	}

	try {
		// сравниваем пароль при логине
		const hashPassword = await bcrypt.compare(password, user.password)
		// создали token
		const token = jwt.sign({ id: user._id }, JWT_SECRET)

		if (hashPassword) {
			user.__v = undefined
			user.password = undefined
			console.log('SignIn user'.bgMagenta, `${user}`)
			User.findOne({ _id: user._id }).select(['-password -__v'])

			return res.json({
				_id: user._id,
				token,
				user,
			})
		} else {
			return res.status(422).json({ message: `Wrong password` })
		}
	} catch (e) {
		console.log(e)
	}
}

export const resetPassword = async (req, res) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err)
		}
		const token = buffer.toString('hex')
		User.findOne({ email: req.body.email }).then((user) => {
			if (!user) {
				return res
					.status(422)
					.json({ message: 'User with this email does not exist' })
			}
			user.resetToken = token
			user.expireToken = Date.now() + 3600000
			user.save().then(() => {
				res.json({ message: 'check your email' })
			})
		})
	})
}

export const setNewPassword = async (req, res) => {
	const newPassword = req.body.password
	const sentToken = req.body.token

	try {
		const user = await User.findOne({
			resetToken: sentToken,
			expireToken: { $gt: Date.now() },
		})
		if (!user) {
			return res.status(422).json({ message: 'Try again session expired' })
		}

		user.password = await bcrypt.hash(newPassword, 12)
		user.resetToken = undefined
		user.expireToken = undefined

		await user.save()

		res.json({ message: 'password updated success' })
	} catch (e) {
		console.error(e)
	}
}
