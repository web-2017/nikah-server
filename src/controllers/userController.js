import User from '../models/userModel.js'
import Profile from '../models/profileModel.js'

export const userController = async (req, res) => {
	User.findOne({ _id: req.params.id })
		.select('-password -__v')
		.then((user) => {
			Profile.find({ postedBy: req.params.id })
				.populate('postedBy')
				.select('-__v')
				.exec((err, profile) => {
					if (err) {
						return res.status(422).json({ error: err })
					}
					//  _id: user._id, token, user

					res.json({ user, profile: profile[0] })
				})
		})
		.catch((err) => {
			return res.status(404).json({ error: 'User not found: ' + err })
		})
}

// update current user
export const updateUserController = async (req, res) => {
	try {
		User.findByIdAndUpdate(
			req.user._id,
			{ $set: req.body },
			{ new: true },
			(err, result) => {
				if (err) {
					return res.status(422).json({ message: err })
				}
				res.json({ user: result })
			}
		).select('-__v -password')
	} catch (e) {
		console.log(e)
	}
}

export const userUpdateProfileImage = async (req, res) => {
	try {
		User.findByIdAndUpdate(
			req.user._id,
			{ $set: { image: req.body.image } },
			{ new: true },
			(err, result) => {
				if (err) {
					return res.status(422).json({ error: 'pic cannot post' })
				}
				res.json(result)
			}
		)
	} catch (e) {
		console.log(e)
	}
}

// search query
export const searchUsersHandler = async (req, res) => {
	let userPattern = new RegExp(`^${req.body.query}`)
	try {
		const user = await User.find({ email: { $regex: userPattern } }).select(
			'_id email'
		)
		await res.json({ user })
	} catch (e) {
		console.error(e)
	}
}
