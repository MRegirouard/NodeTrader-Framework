import DataRequest from '../src/DataRequest'
import CandleInterval, { IntervalUnit } from '../src/CandleInterval'
import type TradingPair from '../src/TradingPair'
import Candleset from '../src/Candleset'
import moment from 'moment'

describe('DataRequest.dateRangeRequest', () =>
{
	test('should return a date range request', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const start = moment('2000-01-01T00:00:00.000Z')
		const end = moment('2000-01-01T00:01:00.000Z') // 1 minute later
		const request = DataRequest.dateRangeRequest(candleset, start, end)

		expect(request).toBeInstanceOf(DataRequest)
		expect(request.candleset).toBe(candleset)
		expect(request.startDate).toBe(start)
		expect(request.endDate).toBe(end)
		expect(request.count).toBeUndefined()
		expect(request.randomCount).toBeUndefined()
	})

	test('should throw an error if the start date is after the end date', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const start = moment('2000-01-01T00:01:00.000Z') // 1 minute later
		const end = moment('2000-01-01T00:00:00.000Z')
		expect(() => { DataRequest.dateRangeRequest(candleset, start, end) })
			.toThrow('End date must be the same as or after start date.')
	})
})

describe('DataRequest.startCountRequest', () =>
{
	test('should return a start count request', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const start = moment('2000-01-01T00:00:00.000Z')
		const count = 100
		const request = DataRequest.startCountRequest(candleset, start, count)

		expect(request).toBeInstanceOf(DataRequest)
		expect(request.candleset).toBe(candleset)
		expect(request.startDate).toBe(start)
		expect(request.endDate).toBeUndefined()
		expect(request.count).toBe(count)
		expect(request.randomCount).toBeUndefined()
	})

	test('should throw an error if the count is less than 0', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const start = moment('2000-01-01T00:00:00.000Z')
		const count = -1
		expect(() => { DataRequest.startCountRequest(candleset, start, count) })
			.toThrow('The number of candles to retrieve must be greater than or equal to 0.')
	})
})

describe('DataRequest.endCountRequest', () =>
{
	test('should return an end count request', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const end = moment('2000-01-01T00:00:00.000Z')
		const count = 100
		const request = DataRequest.endCountRequest(candleset, count, end)

		expect(request).toBeInstanceOf(DataRequest)
		expect(request.candleset).toBe(candleset)
		expect(request.startDate).toBeUndefined()
		expect(request.endDate).toBe(end)
		expect(request.count).toBe(count)
		expect(request.randomCount).toBeUndefined()
	})

	test('should throw an error if the count is less than 0', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const end = moment('2000-01-01T00:00:00.000Z')
		const count = -1
		expect(() => { DataRequest.endCountRequest(candleset, count, end) })
			.toThrow('The number of candles to retrieve must be greater than or equal to 0.')
	})
})

describe('DataRequest.estimateEndDate', () =>
{
	test('should return an end date estimate for a start count request', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const start = moment('2000-01-01T00:00:00.000Z')
		const count = 100
		const request = DataRequest.startCountRequest(candleset, start, count)

		const expected = moment('2000-01-01T01:40:00.000Z') // 100 minutes later
		expect(request.estimateEndDate().toISOString()).toBe(expected.toISOString())
	})

	test('should throw an error if the request is a date range request', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const start = moment('2000-01-01T00:00:00')
		const end = moment('2000-01-01T00:01:00')
		const request = DataRequest.dateRangeRequest(candleset, start, end)

		expect(() => { request.estimateEndDate() })
			.toThrow('Cannot estimate end date of a DataRequest without a count.')
	})

	test('should throw an error if the request is an end count request', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const end = moment('2000-01-01T00:00:00.000Z')
		const count = 100
		const request = DataRequest.endCountRequest(candleset, count, end)

		expect(() => { request.estimateEndDate() })
			.toThrow('Cannot estimate end date of a DataRequest without a start date.')
	})
})

describe('DataRequest.estimateStartDate', () =>
{
	test('should return a start date estimate for an end count request', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const end = moment('2000-01-01T00:00:00.000Z')
		const count = 100
		const request = DataRequest.endCountRequest(candleset, count, end)

		const expected = moment('1999-12-31T22:20:00.000Z') // 100 minutes earlier
		expect(request.estimateStartDate().toISOString()).toBe(expected.toISOString())
	})

	test('should throw an error if the request is a date range request', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const start = moment('2000-01-01T00:00:00.000Z')
		const end = moment('2000-01-01T00:01:00.000Z')
		const request = DataRequest.dateRangeRequest(candleset, start, end)

		expect(() => { request.estimateStartDate() })
			.toThrow('Cannot estimate start date of a DataRequest without a count.')
	})

	test('should throw an error if the request is a start count request', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const start = moment('2000-01-01T00:00:00.000Z')
		const count = 100
		const request = DataRequest.startCountRequest(candleset, start, count)

		expect(() => { request.estimateStartDate() })
			.toThrow('Cannot estimate start date of a DataRequest without an end date.')
	})
})

describe('DataRequest.estimateCount', () =>
{
	test('should return a count estimate for a date range request', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const start = moment('2000-01-01T00:00:00.000Z')
		const end = moment('2000-01-01T01:00:00.000Z') // 60 minutes later
		const request = DataRequest.dateRangeRequest(candleset, start, end)

		expect(request.estimateCount()).toBe(60)
	})

	test('should throw an error if the request is an end count request', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const end = moment('2000-01-01T00:00:00.000Z')
		const count = 100
		const request = DataRequest.endCountRequest(candleset, count, end)

		expect(() => { request.estimateCount() })
			.toThrow('Cannot estimate count of a DataRequest without a start date.')
	})

	test('should throw an error if the request is a start count request', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const start = moment('2000-01-01T00:00:00.000Z')
		const count = 100
		const request = DataRequest.startCountRequest(candleset, start, count)

		expect(() => { request.estimateCount() })
			.toThrow('Cannot estimate count of a DataRequest without an end date.')
	})
})

describe('DataRequest.random', () =>
{
	test('should randomize a date range request', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const start = moment('2000-01-01T00:00:00.000Z')
		const end = moment('2000-01-01T01:00:00.000Z')
		const request = DataRequest.dateRangeRequest(candleset, start, end)
		request.random(30)

		expect(request).toBeInstanceOf(DataRequest)
		expect(request.candleset).toBe(candleset)
		expect(request.startDate).toBe(start)
		expect(request.endDate).toBe(end)
		expect(request.count).toBeUndefined()
		expect(request.randomCount).toBe(30)
	})


	test('should randomize an end count request', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const end = moment('2000-01-01T00:00:00.000Z')
		const count = 100
		const request = DataRequest.endCountRequest(candleset, count, end)
		request.random(30)

		expect(request).toBeInstanceOf(DataRequest)
		expect(request.candleset).toBe(candleset)
		expect(request.startDate).toBeUndefined()
		expect(request.endDate).toBe(end)
		expect(request.count).toBe(count)
		expect(request.randomCount).toBe(30)
	})

	test('should randomize a start count request', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const start = moment('2000-01-01T00:00:00.000Z')
		const count = 100
		const request = DataRequest.startCountRequest(candleset, start, count)
		request.random(30)

		expect(request).toBeInstanceOf(DataRequest)
		expect(request.candleset).toBe(candleset)
		expect(request.startDate).toBe(start)
		expect(request.endDate).toBeUndefined()
		expect(request.count).toBe(count)
		expect(request.randomCount).toBe(30)
	})

	test('should throw an error if the random count is greater than the count', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const start = moment('2000-01-01T00:00:00.000Z')
		const count = 100
		const request = DataRequest.startCountRequest(candleset, start, count)

		expect(() => { request.random(101) })
			.toThrow('Random data count must be less than or equal to data count')
	})
})

describe('DataRequest.toString', () =>
{
	test('should return a string representation of a date range request', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const start = moment('2000-01-01T00:00:00.000Z')
		const end = moment('2000-01-01T01:00:00.000Z')
		const request = DataRequest.dateRangeRequest(candleset, start, end)

		expect(request.toString())
			.toBe('Request of candles between dates 2000-01-01T00:00:00.000Z and 2000-01-01T01:00:00.000Z')
	})

	test('should return a string representation of an end count request', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const end = moment('2000-01-01T00:00:00.000Z')
		const count = 100
		const request = DataRequest.endCountRequest(candleset, count, end)

		expect(request.toString()).toBe('Request of last 100 candles before the date 2000-01-01T00:00:00.000Z')
	})

	test('should return a string representation of a start count request', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const start = moment('2000-01-01T00:00:00.000Z')
		const count = 100
		const request = DataRequest.startCountRequest(candleset, start, count)

		expect(request.toString()).toBe('Request of first 100 candles after the date 2000-01-01T00:00:00.000Z')
	})

	test('should return a string representation of a random date range request', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const start = moment('2000-01-01T00:00:00.000Z')
		const end = moment('2000-01-01T01:00:00.000Z')
		const request = DataRequest.dateRangeRequest(candleset, start, end)
		request.random(30)

		expect(request.toString()).toBe('Random request of 30 candles from candles between dates' +
			' 2000-01-01T00:00:00.000Z and 2000-01-01T01:00:00.000Z')
	})

	test('should return a string representation of a random end count request', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const end = moment('2000-01-01T00:00:00.000Z')
		const count = 100
		const request = DataRequest.endCountRequest(candleset, count, end)
		request.random(30)

		expect(request.toString()).toBe('Random request of 30 candles from last 100 candles before the date' +
			' 2000-01-01T00:00:00.000Z')
	})

	test('should return a string representation of a random start count request', () =>
	{
		const interval = new CandleInterval(IntervalUnit.MINUTE, 1)
		const pair: TradingPair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset(interval, pair)
		const start = moment('2000-01-01T00:00:00.000Z')
		const count = 100
		const request = DataRequest.startCountRequest(candleset, start, count)
		request.random(30)

		expect(request.toString()).toBe('Random request of 30 candles from first 100 candles after the date' +
			' 2000-01-01T00:00:00.000Z')
	})
})
