import colors from 'colors'

colors.setTheme({
	custom: ['bgBlue'],
})

export const logger = (req, res, next) => {
	console.log(`${req.method} ${req.originalUrl.custom}`)
	next()
}
