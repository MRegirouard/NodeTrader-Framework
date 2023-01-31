const DataRequest = require('../src/DataRequest')
const Candleset = require('../src/Candleset')
const CandleInterval = require('../src/CandleInterval')
const moment = require('moment')

describe('DataRequest.toString()', () => {
	test('should return an unknown message when there is a startDate but no count', () =>
	{
		const interval = new CandleInterval.default(CandleInterval.IntervalUnit.MINUTE, 1)
		const pair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset.default(interval, pair)
		const request = new DataRequest.DataRequest(candleset)
		request._startDate = moment("2000-01-01T00:00:00.000Z")

		expect(request.toString()).toBe("Request of unknown number of candles after the date 2000-01-01T00:00:00.000Z")
	})

	test('should return an unknown message when there is no startDate or endDate', () =>
	{
		const interval = new CandleInterval.default(CandleInterval.IntervalUnit.MINUTE, 1)
		const pair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset.default(interval, pair)
		const request = new DataRequest.DataRequest(candleset)

		expect(request.toString()).toBe("Request of unknown number of candles between unknown dates")
	})

	test('should return an unknown message when there is an endDate but no count or startDate', () =>
	{
		const interval = new CandleInterval.default(CandleInterval.IntervalUnit.MINUTE, 1)
		const pair = { base: 'USDT', trade: 'BTC' }
		const candleset = new Candleset.default(interval, pair)
		const request = new DataRequest.DataRequest(candleset)
		request._endDate = moment("2000-01-01T00:00:00.000Z")

		expect(request.toString()).toBe("Request of unknown number of candles before the date 2000-01-01T00:00:00.000Z")
	})
})
