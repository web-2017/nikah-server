import { unlink } from 'fs'

import Post from '../models/post.js'
import { postService } from './postService.js'

export const allPostsController = async (req, res) => {
	try {
		const posts = await Post.find()
			.populate('postedBy', '-__v -password')
			.sort('-createdAt') // later post come first

		await res.json(posts)
		// sendMessage()
	} catch (e) {
		console.log(e)
	}
}

export const createPostController = async (req, res) => {
	const { title, description } = req.body

	// console.log(req.body)

	if (!title || !description)
		return res
			.status(422)
			.json({ error: 'Title and description are required!' })

	// console.log('user', req.user)

	// remove unused keys
	req.user.password = undefined
	req.user.__v = undefined

	try {
		postService({
			...req.body,
			postedBy: req.user,
		})

		postService.save().then(() => res.json(post))
	} catch (e) {
		console.log(e)
	}
}

export const getPostController = async (req, res) => {
	try {
		const post = await Post.findOne({ _id: req.params.postId }).populate(
			'postedBy',
			'_id tel firstName coords.address email'
		)
		return res.json(post)
	} catch (e) {
		return res.status(422).json({ error: 'postId is required' })
	}
}

export const editPostController = async (req, res) => {
	console.log('body', req.body)
	try {
		Post.findByIdAndUpdate(
			req.body.postId,
			{ ...req.body },
			{ new: true }
		).exec((err, post) => {
			if (err) return res.status(422).json({ error: err })
			else return res.status(200).json(post)
		})
	} catch (e) {
		return res.status(422).json({ error: 'postId is required' })
	}
}

export const subscribePostsController = async (req, res) => {
	try {
		// if postedBy in following
		const posts = await Post.find({ postedBy: { $in: req.user.following } })
			.populate('postedBy', '_id name')
			// .populate('comments.postedBy', '_id name')
			.sort('-createdAt') // later post come first

		res.json(posts)
	} catch (e) {
		console.log(e)
	}
}

export const myPosts = async (req, res) => {
	const posts = await Post.find({ postedBy: req.user._id }).select('-__v')
	return await res.status(200).json(posts)
}

export const likePostController = async (req, res) => {
	Post.findByIdAndUpdate(
		req.body.postId,
		{ $push: { likes: req.user._id } },
		{ new: true }
	)
		.populate('postedBy', '_id tel firstName coords.address email')
		.exec((err, result) => {
			if (err) {
				return res.status(422).json({ error: err })
			} else {
				return res.json(result)
			}
		})
}

export const unLikePostController = async (req, res) => {
	Post.findByIdAndUpdate(
		req.body.postId,
		{ $pull: { likes: req.user._id } },
		{ new: true }
	)
		.populate('postedBy', '_id tel firstName coords.address email')
		.exec((err, result) => {
			if (err) return res.status(422).json({ error: err })
			else return res.json(result)
		})
}

export const commentPostController = async (req, res) => {
	const comment = {
		text: req.body.text,
		postedBy: req.user._id,
	}
	Post.findByIdAndUpdate(
		req.body.postId,
		{
			$push: { comments: comment },
		},
		{
			new: true,
		}
	)
		.populate('postedBy', '_id name')
		.populate('comments.postedBy', '_id name')
		.exec((err, result) => {
			if (err) return res.status(422).json({ error: err })
			else return res.status(200).json(result)
		})
}

export const deletePostController = async (req, res) => {
	Post.findOne({ _id: req.params.postId })
		.populate('postedBy', '_id name')
		.exec((err, post) => {
			if (err || !post) return res.status(422).json({ error: err })

			if (post.postedBy._id.toString() === req.user._id.toString()) {
				console.log('post', post)
				post
					.remove()
					.then((result) => {
						// console.log('result', result)
						unlink(result.images[0], () => {
							console.log('Успешно удалили фаил: ' + result)
							res.json({ message: 'Removed file success', result })
						})
					})
					.catch((err) => {
						console.log(err)
					})
			}
		})
}

export const deleteCommentController = async (req, res) => {
	const comment = { _id: req.params.commentId }
	console.log(1, req.params)

	Post.findByIdAndUpdate(
		req.params.id,
		{ $pull: { comments: comment } },
		{ new: true }
	)
		.populate('comments.postedBy', '_id name')
		.populate('postedBy', '_id name ')
		.exec((err, postComment) => {
			console.log('postComment', postComment)
			console.log('req.user._id', req.user._id)
			if (err || !postComment) return res.status(422).json({ error: err })

			if (postComment.postedBy._id.toString() === req.user._id.toString()) {
				res.json(postComment)
			}
		})
}
