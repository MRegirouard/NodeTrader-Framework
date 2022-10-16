/**
 * A custom logger for this project 
 */

 import winston from 'winston'
 import DailyRotateFile from 'winston-daily-rotate-file' 

// Create a custom log format that prints the timestamp, level, and message in a formated way
const customFormat = winston.format.printf((info : winston.LogEntry) =>
{
	var spaceVal = 7

	if (info.level.length > 7)
		spaceVal = 17

	info.level = info.level.padStart(info.level.length + Math.floor((spaceVal - info.level.length) / 2), ' ')
	info.level = info.level.padEnd(spaceVal, ' ')
	const date = new Date()
	info.timestamp = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
	info.timestamp = info.timestamp.slice(0, -3) + '.' + date.getMilliseconds().toString().padStart(3, '0') + info.timestamp.slice(-3)

	var log = `[ ${info.timestamp} ] [ ${info.level} ]`

	if (info.path)
	{
		const filename = info.path.split('/').pop()
		log += ` [ ${filename} ]`
	}

	if (info.tradingName) // Logs from trading algorithms should display the trading name
	{
		info.tradingName = info.tradingName.padStart(info.tradingName.length + Math.floor((10 - info.tradingName.length) / 2), ' ')
		info.tradingName = info.tradingName.padEnd(10, ' ')

		if (spaceVal === 17) // If we need to add color codes
		{
			if (info.isUser) // Yellow for user messages
				info.tradingName = '\u001b[33m' + info.tradingName
			else // Blue for system messages
				info.tradingName = '\u001b[34m' + info.tradingName

			info.tradingName += '\x1B[39m' // Reset color
		}

		log += ` [ ${info.tradingName} ]`
	}

	log += ` ${info.message}`
	return log
})

// A custom log format to capitalize the log level
const capsFormat = winston.format((info : winston.LogEntry) =>
{
	info.level = info.level.toUpperCase()
	return info
})()

// Return a function to create the logger
function createLogger() : winston.Logger
{
	return winston.createLogger({
		exitOnError: false,
		level: 'silly',
		transports: [
			new DailyRotateFile(
			{
				filename: 'logs/%DATE%.log',
				format: winston.format.combine(capsFormat, customFormat),
			}),
			new winston.transports.Console(
			{
				format: winston.format.combine(capsFormat, winston.format.colorize(), customFormat),
				level: 'warn',
			})
		]
	})
}

const log : winston.Logger = createLogger()

export { createLogger }
export default log