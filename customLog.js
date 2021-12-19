/**
 * A custom logger for this project 
 */

const winston = require('winston')
const rotateFile = require('winston-daily-rotate-file')

// Create a custom log format that prints the timestamp, level, and message in a formated way
const customFormat = winston.format.printf((info) =>
{
	var spaceVal = 7

	if (info.level.length > 7)
		spaceVal = 17

	info.level = info.level.padStart(info.level.length + Math.floor((spaceVal - info.level.length) / 2), ' ')
	info.level = info.level.padEnd(spaceVal, ' ')
	info.timestamp = new Date().toLocaleString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })

	return `[ ${info.timestamp} ] [ ${info.level} ] ${info.message}` // Return the formatted message
})

// A custom log format to capitalize the log level
const capsFormat = winston.format((info) =>
{
	info.level = info.level.toUpperCase()
	return info
})()

// Create the logger
const log = winston.createLogger(
{
	exitOnError: false,
	level: 'silly',
	transports: [
		new rotateFile(
		{
			filename: 'logs/%DATE%.log',
			format: winston.format.combine(capsFormat, customFormat),
		}),
		new winston.transports.Console(
		{
			format: winston.format.combine(capsFormat, winston.format.colorize(), customFormat),
		})
	]
})

module.exports = log