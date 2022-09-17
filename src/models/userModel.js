import mongoose from 'mongoose'

import { stringRequiredType, numberRequiredType } from '../utils/typeModel.js'

const userSchema = new mongoose.Schema(
	{
		uniqUserId: {
			type: String,
			default: Date.now(),
		},
		firstName: stringRequiredType,
		lastName: stringRequiredType,
		dob: stringRequiredType,
		email: stringRequiredType,
		phone: numberRequiredType,
		password: stringRequiredType,
		sex: { ...stringRequiredType, default: 'male' },
		profileCreatedBy: { ...stringRequiredType, default: 'mySelf' },
		role: {
			type: String,
			default: 'User',
		},
	},
	{ timestamps: true }
)

const User = mongoose.model('User', userSchema)
export default User
