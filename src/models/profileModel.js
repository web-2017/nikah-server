import mongoose from 'mongoose'

const { ObjectId } = mongoose.Schema.Types

import { stringRequiredType, numberRequiredType } from '../utils/typeModel.js'

const profileSchema = new mongoose.Schema(
	{
		quran: {
			aboutMarriage: {
				type: String,
				default: 'Allah',
			},
		},
		description: {
			...stringRequiredType,
			required: false,
			default: '',
		},
		familyStatus: stringRequiredType,
		kids: numberRequiredType,
		wannaKidsMore: {
			...stringRequiredType,
			required: false,
			default: 'no answer',
		},
		languages: String,
		image: {
			...stringRequiredType,
			required: false,
		},
		// kindOfMazhab: {
		// 	...stringRequiredType,
		// 	required: false,
		// 	default: 'no answer',
		// },
		levelOfFaith: { ...stringRequiredType, default: 'no answer' },
		akida: stringRequiredType,
		convertMuslim: stringRequiredType,
		originRace: stringRequiredType,
		appearance: {
			height: stringRequiredType,
			weight: stringRequiredType,
			disability: {
				...stringRequiredType,
				required: false,
				default: 'no answer',
			},
		},
		origin: {
			nationality: stringRequiredType,
			countryOfBirth: stringRequiredType,
			countryLiveNow: stringRequiredType,
			cityLiveNow: stringRequiredType,
			statusResident: stringRequiredType,
		},
		career: {
			qualification: String,
			jobTitle: stringRequiredType,
			specialization: stringRequiredType,
			education: stringRequiredType,
		},
		incomeMonth: Number,
		incomeYear: Number,
		postedBy: {
			type: ObjectId,
			ref: 'User',
		},
	},

	{ timestamps: true }
)

const Profile = mongoose.model('Profile', profileSchema)
export default Profile
