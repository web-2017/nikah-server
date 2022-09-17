export const uploadsFile = async (req, res, next) => {
	const file = req.file
	// console.log('111', req.file)
	try {
		if (file)
			res
				.status(200)
				.json({ success: 'Success Image upload!', uri: req.file.path })
		next()
	} catch (err) {
		if (!file)
			return res.status(422).json({ error: 'Image are required!', err })
	}
}
