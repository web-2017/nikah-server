import mongoose from 'mongoose'
import { MONGO_DB } from './keys.js'

export default function dbConnection() {
	mongoose.connect(MONGO_DB)

	mongoose.connection.on('connected', () => {
		console.log('Connected to database successfully')
	})

	mongoose.connection.on('error', (err) => {
		console.log('Error while connected to database ' + err)
	})

	mongoose.connection.on('disconnected', (err) => {
		console.log('Mongodb  connection disconnected')
	})
}
