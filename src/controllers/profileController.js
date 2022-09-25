import 'querystring'

import Profile from '../models/profileModel.js'
import User from '../models/userModel.js'

export const createProfile = async (req, res) => {
	const { familyStatus, originRace } = req.body

	if (!familyStatus || !originRace) {
		return res.status(422).json({ error: 'All fields are required!' })
	}

	try {
		const profile = await Profile.create({
			...req.body,
			postedBy: req.user,
			user: req.user,
		})

		profile.save().then(() => res.json(profile))
	} catch (e) {
		console.log(e)
	}
}

export const getProfile = async (req, res) => {
	try {
		if (!req.params.userId) {
			return res.status(422).json({ message: 'userId is required' })
		}

		const currentProfile = await Profile.findOne({
			postedBy: req.params.userId,
		}).select('-__v -password')

		const user = await User.findOne({ _id: req.params.userId }).select(
			'-__v -password'
		)
		return res.json({ profile: currentProfile, user: user })
	} catch (error) {
		console.log(error)
		return res.status(422).json({ message: 'Error ', error })
	}
}

export const allProfiles = async (req, res) => {
	try {
		// example query = http://localhost:4000/v1/profiles?wannaKidsMore=no&familyStatus=married

		const query = req.query
		console.log('query', query)

		// filter $or options

		const filterOrOptions = [
			{ wannaKidsMore: query.wannaKidsMore },
			{ incomeMonth: { $gte: query.incomeMonth } },
			{ languages: { $regex: `${query.languages}`, $options: 'i' } },
			{ incomeMonth: { $gte: query.incomeMonth } },
			{ incomeYear: { $gte: query.incomeYear } },
			{ age: { $gte: query.fromAge, $lt: query.toAge } }, // age from - to
			{ akida: query.akida },
			{ convertMuslim: query.convertMuslim },
			{ originRace: query.originRace },
			{ familyStatus: query.familyStatus },
		]

		// filter by query
		const filterOptions = {
			languages: { $regex: `${query.languages}`, $options: 'i' },
			incomeMonth: { $gte: query.incomeMonth },
			incomeYear: { $gte: query.incomeYear },
			akida: { $regex: `${query.akida}`, $options: 'i' },
			age: { $gte: query.fromAge, $lte: query.toAge },
		}
		let options = {
			...req.query,
		}

		const arr = ['languages', 'incomeMonth', 'incomeYear', 'age']

		arr.forEach((element) => {
			for (const key in req.query) {
				if (key === element) {
					options[key] = filterOptions[key]
				}

				if (key === 'height') {
					options = {
						[`appearance.height`]: { $gte: req.query.height },
					}
				}
				if (key === 'fromAge') {
					options.age = filterOptions.age
				}
			}
		})

		console.log(options)

		const profiles = await Profile.find(options)
			.sort({ createdAt: 1 })
			.limit(100)

		return res.json({ success: true, count: profiles?.length, profiles })
	} catch (error) {
		console.log(error)
		return res.status(422).json({ message: 'Error ' + error })
	}
}

export const editProfile = async (req, res) => {
	if (!req.body.postId) {
		return res.status(422).json({ message: 'postId is required' })
	}

	try {
		Profile.findByIdAndUpdate(
			req.body.postId,
			{
				...req.body,
				// ! remove field {user} after test, because it already exist in profileCreatedController
				user: req.user,
			},
			{ new: true }
		).exec((err, post) => {
			if (err) return res.status(422).json({ error: err })
			else return res.json(post)
		})
	} catch (e) {
		console.log(e)
	}
}
