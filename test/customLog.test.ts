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
import log, { createLogger } from '../src/customLog'

const logFileTimeout = 100 // Timeout to wait for the log file to be written to
jest.setTimeout(logFileTimeout + 50) // Add a little extra time to the test timeout

let tmpLogger: Logger
let mockConsole: jest.SpyInstance

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

/**
 * Test the logs/ folder and the stdout mock for the given strings. Verifies that the log file has a valid name.
 * @param fileMessages The messages that should be in the log files
 * @param stdoutMessages The messages that should be in the stdout mock
 * @param callback The callback to run after testing is complete
 */
function checkLogOuts(fileMessages: string[], stdoutMessages: string[]): Promise<void>
{
	const promise = new Promise<void>((resolve) =>
	{
		const logDate = new Date()

		// Check console messages
		if (stdoutMessages.length > 0)
			expect(mockConsole).toHaveBeenCalled()

		for (const message of stdoutMessages)

			expect(mockConsole).toHaveBeenCalledWith(expect.stringContaining(message))


		vol.readdir('logs/', (dirErr, files) =>
		{
			expect(dirErr).toBeNull()
			expect(files).toBeDefined()
			expect(files?.length).toBe(1)

			// File name checking
			const filename = (files as string[])[0]
			const nameSections = filename.split('.')
			expect(nameSections.length).toBe(2)
			expect(nameSections[1]).toBe('log')

			// File name date format checking
			const firstNameSections = nameSections[0].split('-')
			expect(firstNameSections.length).toBe(3)
			expect(firstNameSections[0]).toBe(logDate.getFullYear().toString())
			expect(firstNameSections[1]).toBe((logDate.getMonth() + 1).toString().padStart(2, '0'))
			expect(firstNameSections[2]).toBe(logDate.getDate().toString().padStart(2, '0'))

			vol.readFile(`logs/${(files as string[])[0]}`, (fileErr, data) =>
			{
				expect(fileErr).toBeNull()
				expect(data).toBeDefined()

				// Check file messages
				for (const message of fileMessages)
					expect(data?.toString()).toContain(message)

				resolve()
			})
		})
	})

	const timeout = new Promise<void>((reject) =>
	{
		setTimeout(reject, logFileTimeout)
	})

	return Promise.race([ promise, timeout ])
}

// Due to the way filesystem mocking works, the default logger will only work once
describe('default logger', () =>
{
	test('should log to the correct file', () =>
	{
		return new Promise((resolve) =>
		{
			expect(log).toBeTruthy()
			log.verbose('test message')
			checkLogOuts([ 'test message', 'VERBOSE' ], []).then(resolve)
		})
	})
})

// Test every log level
describe('log level functions', () =>
{
	for (const level in log.levels)
	{
		test(`should create a ${level} message in the correct file`, async() =>
		{
			tmpLogger.log(level, 'test message')

			const expectFile = [ level.toUpperCase(), 'test message' ]
			const expectStdout = [ level.toUpperCase(), 'test message' ]

			await expect(checkLogOuts(expectFile, expectStdout)).resolves.toBeUndefined()
		})

		test(`should create a ${level} message with the correct path in the correct file`, async() =>
		{
			tmpLogger = tmpLogger.child({ path: module.filename })
			tmpLogger.log(level, 'test message')

			const fileName = module.filename.split('/').pop()
			expect(fileName).toBeDefined()
			expect(fileName).not.toBeNull()
			expect(fileName?.split('/').length).toBeGreaterThanOrEqual(1)
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const expectFile = [ level.toUpperCase(), 'test message', fileName! ]
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const expectStdout = [ level.toUpperCase(), 'test message', fileName! ]

			await expect(checkLogOuts(expectFile, expectStdout)).resolves.toBeUndefined()
		})

		test(`should create a ${level} message with the correct tradingName in the correct file`, async() =>
		{
			tmpLogger = tmpLogger.child({ tradingName: 'TestTrade' })
			tmpLogger.log(level, 'test message')

			const expectFile = [ level.toUpperCase(), 'test message', 'TestTrade' ]
			const expectStdout = [ level.toUpperCase(), 'test message', '\u001b[34mTestTrade' ]

			await expect(checkLogOuts(expectFile, expectStdout)).resolves.toBeUndefined()
		})

		test(`should create a ${level} message with the correct tradingName in the correct file` +
			' with the yellow color for user log messages', async() =>
		{
			tmpLogger = tmpLogger.child({ tradingName: 'TestTrade', isUser: true })
			tmpLogger.log(level, 'test message')

			const expectFile = [ level.toUpperCase(), 'test message', 'TestTrade' ]
			const expectStdout = [ level.toUpperCase(), 'test message', '\u001b[33mTestTrade' ]

			await expect(checkLogOuts(expectFile, expectStdout)).resolves.toBeUndefined()
		})
	}
})
