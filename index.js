import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

const app = express()

import dbConnection from './src/config/dbConnect.js'
// imports
import { PORT } from './src/config/keys.js'
import authRouter from './src/router/auth.js'
import profileRouter from './src/router/profile.js'
import userRouter from './src/router/user.js'
import searchRouter from './src/router/search.js'

const port = PORT || 4000

// connection to database
dbConnection()

// setting
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

// routes
app.use('/v1', authRouter)
app.use('/v1', userRouter)
app.use('/v1', profileRouter)
app.use('/v1', searchRouter)

// Listen Port
app.listen(port || 4000, () =>
	console.log(`PORT listen http://localhost:${port}`)
)
