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

		// const { ...rest } = req.query
		// Object.keys(rest).map((elem) => {
		// 	console.log({ [elem]: elem })
		// })

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
			wannaKidsMore: query.wannaKidsMore || 'yes',
			languages: { $regex: `${query.languages || 'English'}`, $options: 'i' },
			incomeMonth: { $gte: query.incomeMonth || 3000 },
			incomeYear: { $gte: query.incomeYear || 40000 },
			age: { $gte: query.fromAge || 20, $lt: query.toAge || 30 }, // age from - to
			akida: { $regex: `${query.akida || 'ahlu'}`, $options: 'i' },
			convertMuslim: query.convertMuslim || 'no',
			originRace: query.originRace || 'white',
			familyStatus: query.familyStatus || 'never',
		}
		const profiles = await Profile.find(
			Object.keys(query).length ? filterOptions : undefined
		)
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
			{ ...req.body },
			{ new: true }
		).exec((err, post) => {
			if (err) return res.status(422).json({ error: err })
			else return res.json(post)
		})
	} catch (e) {
		console.log(e)
	}
}
