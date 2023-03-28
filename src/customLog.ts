/**
 * A custom logger for this project
 */

import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

// Create a custom log format that prints the timestamp, level, and message in a formated way
const customFormat = winston.format.printf((info: winston.LogEntry) =>
{
	let spaceVal = 7

	if (info.level.length > 7)
		spaceVal = 17

	info.level = info.level.padStart(info.level.length + Math.floor((spaceVal - info.level.length) / 2), ' ')
	info.level = info.level.padEnd(spaceVal, ' ')
	const date = new Date()
	let timestamp: string = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
	timestamp = `${timestamp.slice(0, -3)}.${date.getMilliseconds().toString().padStart(3, '0')}` +
		`${timestamp.slice(-3)}`

	let logMsg = `[ ${timestamp} ] [ ${info.level} ]`

	if (info.path != null)
	{
		const filename: string = info.path.split('/').pop()
		logMsg += ` [ ${filename} ]`
	}

	// Logs from trading algorithms should display the trading name
	if (info.tradingName != null && typeof info.tradingName == 'string')
	{
		let tradingName: string = info.tradingName
		tradingName = info.tradingName.padStart(info.tradingName.length +
			Math.floor((10 - info.tradingName.length) / 2), ' ').padEnd(10, ' ')

		if (spaceVal === 17) // If we need to add color codes
		{
			if (info.isUser == null) // Yellow for user messages
				tradingName = `\u001b[34m${tradingName}`
			else // Blue for system messages
				tradingName = `\u001b[33m${tradingName}`

			tradingName += '\x1B[39m' // Reset color
		}

		logMsg += ` [ ${tradingName} ]`
	}

	logMsg += ` ${info.message}`
	return logMsg
})

// A custom log format to capitalize the log level
const capsFormat = winston.format((info: winston.LogEntry) =>
{
	info.level = info.level.toUpperCase()
	return info
})()

const rawFormat = winston.format.printf((info: winston.LogEntry) =>
{
	return info.message
})

// Return a function to create the logger
function createLogger(): winston.Logger
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
				}),
		],
	})
}

const log: winston.Logger = createLogger()

function createRawLogger(): winston.Logger
{
	return winston.createLogger({
		exitOnError: false,
		level: 'silly',
		transports: [
			new winston.transports.Console(
				{
					format: rawFormat,
				}
			),
			new DailyRotateFile(
				{
					filename: 'logs/%DATE%.raw.log',
					format: rawFormat,
				}),
		],
	})
}

const rawLog: winston.Logger = createRawLogger()

export { createLogger, createRawLogger, rawLog }
export default log
