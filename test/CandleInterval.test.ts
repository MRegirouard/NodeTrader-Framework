import CandleInterval, { IntervalUnit } from '../src/CandleInterval'

const validUnits = [
	IntervalUnit.YEAR,
	IntervalUnit.MONTH,
	IntervalUnit.WEEK,
	IntervalUnit.DAY,
	IntervalUnit.HOUR,
	IntervalUnit.MINUTE,
]

describe('CandleInterval', () =>
{
	test('should be able to create a new CandleInterval', () =>
	{
		for (const unit of validUnits)
		{
			const interval = new CandleInterval(unit as IntervalUnit, 1)
			expect(interval.unit).toBe(unit)
			expect(interval.amount).toBe(1)
		}
	})
})

describe('CandleInterval.toString', () =>
{
	test('should return a string representation of the interval', () =>
	{
		for (const unit of validUnits)
		{
			const interval = new CandleInterval(unit as IntervalUnit, 1)
			expect(interval.toString()).toBe(`1${unit}`)
		}
	})
})

describe('CandleInterval.fromString', () =>
{
	test('should be able to create a CandleInterval from a string', () =>
	{
		const interval = CandleInterval.fromString('5m')
		expect(interval.unit).toBe(IntervalUnit.MINUTE)
		expect(interval.amount).toBe(5)
	})

	test('should re-create a CandleInterval from its toString representation', () =>
	{
		for (const unit of validUnits)
		{
			const interval = new CandleInterval(unit as IntervalUnit, 1)
			expect(CandleInterval.fromString(interval.toString())).toEqual(interval)
		}
	})

	test('should throw an error if the string is too short', () =>
	{
		expect(() => CandleInterval.fromString('')).toThrow()
	})

	test('should throw an error if the string has an invalid interval', () =>
	{
		expect(() => CandleInterval.fromString('5x')).toThrow()
	})

	test('should throw an error if the string has an invalid amount', () =>
	{
		expect(() => CandleInterval.fromString('-1m')).toThrow()
		expect(() => CandleInterval.fromString(`${Math.sqrt(-1)}s`)).toThrow()
	})
})
