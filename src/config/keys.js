import path from 'path'
import dotenv from 'dotenv'
const baseDir = path.resolve()
dotenv.config()
// dotenv.config({ path: `${baseDir}/.env` })

export const PORT = process.env.PORT
export const MONGO_DB = process.env.MONGO_DB
export const JWT_SECRET = process.env.JWT_SECRET
