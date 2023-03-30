/* eslint-disable @typescript-eslint/no-loop-func */
import { vol } from 'memfs'
import { mockProcessStdout } from 'jest-mock-process'

// Mock the fs module, so logs are written to memory instead of the disk
jest.mock('fs')
jest.mock('fs/promises')

// Set the current working directory to the root of the filesystem, fixes some "no such file or directory" errors
process.chdir('/')
// Reset the filesystem before importing the logger so the default logger is created with the correct working directory
vol.reset()

// These imports must come after setting the working directory to /
import type { Logger } from 'winston'
import log, { createLogger, createRawLogger } from '../src/customLog'

const logFileTimeout = 100 // Timeout to wait for the log file to be written to
jest.setTimeout(logFileTimeout + 50) // Add a little extra time to the test timeout

let mockConsole: jest.SpyInstance = mockProcessStdout()

/**
 * Check that the given messages are in the console output. Calls the
 * "expect" function to fail the test if they are not.
 * @param messages The strings to check for
 */
function checkStdOut(messages: string[]): void
{
	if (messages.length > 0)
		expect(mockConsole).toHaveBeenCalled()
	else
		expect(mockConsole).not.toHaveBeenCalled()

	for (const message of messages)
		expect(mockConsole).toHaveBeenCalledWith(expect.stringContaining(message))
}

/**
 * Check that the log output file contains the given messages. Calls the "expect" function to fail the test
 * if they are not. Either checks for a "raw" log file or a normal log file.
 * @param isRawLog Whether to check for a raw log file. If false, checks for a normal log file.
 * @param messages The strings to check for
 */
function checkFileOut(isRawLog: boolean, messages: string[]): void
{
	const files = vol.readdirSync('logs/') as string[]
	expect(files.length).toBeGreaterThanOrEqual(1)

	let foundFiles: string[] = []

	if (isRawLog)
		foundFiles = files.filter((file) => file.endsWith('.raw.log'))
	else
		foundFiles = files.filter((file) => file.endsWith('.log') && !file.endsWith('.raw.log'))

	if (messages.length === 0)
	{
		expect(foundFiles.length).toBe(0)
		return
	}
	expect(foundFiles.length).toBe(1)

	const data = vol.readFileSync(`logs/${foundFiles[0]}`, 'utf8')

	for (const message of messages)
		expect(data).toContain(message)
}

/**
 * Check that a log file with the correct name exists. Calls the "expect" function to fail the
 * test if it does not. Checks for a "raw" log file or a normal log file.
 * @param isRawLog Whether to check for a raw log file. If false, checks for a normal log file.
 * @param date The date the file should be named after
 * @param fileCount The number of files that should exist in the logs directory
 */
function checkFileName(isRawLog: boolean, date: Date, fileCount: number): void
{
	const files = vol.readdirSync('logs/') as string[]
	expect(files.length).toBe(fileCount)
	let foundOne = false

	// File name checking
	for (const filename of files)
	{
		if (isRawLog && !filename.endsWith('.raw.log'))
			continue
		else if (!isRawLog && !filename.endsWith('.log'))
			continue

		foundOne = true

		const nameSections = filename.split('.')[0].split('-')
		expect(nameSections.length).toBe(3)
		expect(nameSections[0]).toBe(date.getFullYear().toString())
		expect(nameSections[1]).toBe((date.getMonth() + 1).toString().padStart(2, '0'))
		expect(nameSections[2]).toBe(date.getDate().toString().padStart(2, '0'))
	}

	expect(foundOne).toBe(true)
}

// Due to the way filesystem mocking works, the default logger will only work once
describe('default logger', () =>
{
	test('should log to the correct file', () =>
	{
		return new Promise<void>((resolve) =>
		{
			expect(log).toBeTruthy()
			expect(() => log.verbose('test message')).not.toThrow()

			setTimeout(() =>
			{
				checkFileName(false, new Date(), 2)
				checkFileName(true, new Date(), 2)
				checkFileOut(false, [ 'test message', 'VERBOSE' ])
				// Don't check for an empty raw file here, as the default raw logger will always create one
				checkStdOut([ ])
				resolve()
			}, logFileTimeout)
		})
	})
})

// Test every log level
describe('log level functions', () =>
{
	let tmpLogger: Logger

	beforeEach(() =>
	{
		// Reset before each test
		process.chdir('/')
		vol.reset()
		tmpLogger = createLogger()

		// Make every transport log at every level
		for (const transport of tmpLogger.transports)
			transport.level = Object.keys(tmpLogger.levels)[Object.keys(tmpLogger.levels).length - 1]

		// Mock console output
		mockConsole = mockProcessStdout()
	})

	afterEach(() =>
	{
		// Clear the console mock
		mockConsole.mockRestore()
	})

	for (const level in log.levels)
	{
		test(`should create a ${level} message in the correct file`, () =>
		{
			return new Promise<void>((resolve) =>
			{
				expect(() => tmpLogger.log(level, 'test message')).not.toThrow()

				setTimeout(() =>
				{
					checkFileName(false, new Date(), 1)
					checkFileOut(false, [ level.toUpperCase(), 'test message' ])
					checkFileOut(true, [ ])
					checkStdOut([ level.toUpperCase(), 'test message' ])
					resolve()
				}, logFileTimeout)
			})
		})

		test(`should create a ${level} message with the correct path in the correct file`, () =>
		{
			return new Promise<void>((resolve) =>
			{
				tmpLogger = tmpLogger.child({ path: module.filename })
				expect(() => tmpLogger.log(level, 'test message')).not.toThrow()

				setTimeout(() =>
				{
					checkFileName(false, new Date(), 1)
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					checkFileOut(false, [ level.toUpperCase(), 'test message', module.filename.split('/').pop()! ])
					checkFileOut(true, [ ])
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					checkStdOut([ level.toUpperCase(), 'test message', module.filename.split('/').pop()! ])
					resolve()
				}, logFileTimeout)
			})
		})

		test(`should create a ${level} message with the correct tradingName in the correct file`, () =>
		{
			return new Promise<void>((resolve) =>
			{
				tmpLogger = tmpLogger.child({ tradingName: 'TestTrade' })
				expect(() => tmpLogger.log(level, 'test message')).not.toThrow()

				setTimeout(() =>
				{
					checkFileName(false, new Date(), 1)
					checkFileOut(false, [ level.toUpperCase(), 'test message', 'TestTrade' ])
					checkFileOut(true, [ ])
					checkStdOut([ level.toUpperCase(), 'test message', '\u001b[34mTestTrade' ])
					resolve()
				}, logFileTimeout)
			})
		})

		test(`should create a ${level} message with the correct tradingName in the correct file` +
			' with the yellow color for user log messages', () =>
		{
			return new Promise<void>((resolve) =>
			{
				tmpLogger = tmpLogger.child({ tradingName: 'TestTrade', isUser: true })
				expect(() => tmpLogger.log(level, 'test message')).not.toThrow()

				setTimeout(() =>
				{
					checkFileName(false, new Date(), 1)
					checkFileOut(false, [ level.toUpperCase(), 'test message', 'TestTrade' ])
					checkFileOut(true, [ ])
					checkStdOut([ level.toUpperCase(), 'test message', '\u001b[33mTestTrade' ])
					resolve()
				}, logFileTimeout)
			})
		})
	}
})

describe('raw log level functions', () =>
{
	let tmpLogger: Logger

	beforeEach(() =>
	{
		// Reset before each test
		process.chdir('/')
		vol.reset()
		tmpLogger = createRawLogger()

		// Make every transport log at every level
		for (const transport of tmpLogger.transports)
			transport.level = Object.keys(tmpLogger.levels)[Object.keys(tmpLogger.levels).length - 1]

		// Mock console output
		mockConsole = mockProcessStdout()
	})

	afterEach(() =>
	{
		// Clear the console mock
		mockConsole.mockRestore()
	})

	for (const level in log.levels)
	{
		test(`should create a ${level} message in the correct file`, () =>
		{
			return new Promise<void>((resolve) =>
			{
				expect(() => tmpLogger.log(level, 'test raw message')).not.toThrow()

				setTimeout(() =>
				{
					checkFileName(true, new Date(), 1)
					checkFileOut(true, ['test raw message'])
					checkFileOut(false, [ ])
					checkStdOut(['test raw message'])
					resolve()
				}, logFileTimeout)
			})
		})
	}
})
