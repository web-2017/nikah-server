import Profile from '../models/profileModel.js'
import User from '../models/userModel.js'

export const searchController = async (req, res) => {
	try {
	} catch (error) {
		return res.status(422).json({ message: 'Error' })
	}
	// multiple search
	// let filterData = await Profile.find({
	// 	$or: [
	// 		{ languages: { $regex: req.params.query } },
	// 		{ familyStatus: { $regex: req.params.query } },
	// 	],
	// })
	const profiles = await Profile.find()
	console.log(req.query)

	let match = await profiles.filter((elem) =>
		elem[req.query.key].includes(searchName)
	)

	const page = parseInt(req.query.page) - 1 || 0
	const limit = parseInt(req.query.limit) || 5
	const search = req.query.search || ''
	let sort = req.query.sort || 'rating'
	return res.json({ match })
}
