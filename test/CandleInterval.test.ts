import CandleInterval from '../src/CandleInterval'

describe('CandleInterval', () =>
{
	test('should be able to create a new CandleInterval', () =>
	{
		for (const unit of Object.values((CandleInterval as any).IntervalUnit))
		{
			const interval = new CandleInterval(unit as CandleInterval.IntervalUnit, 1)
			expect(interval.unit).toBe(unit)
			expect(interval.amount).toBe(1)
		}
	})
})

describe('CandleInterval.toString', () =>
{
	test('should return a string representation of the interval', () =>
	{
		for (const unit of Object.values((CandleInterval as any).IntervalUnit))
		{
			const interval = new CandleInterval(unit as CandleInterval.IntervalUnit, 1)
			expect(interval.toString()).toBe(`1${unit}`)
		}
	})
})

describe('CandleInterval.fromString', () =>
{
	test('should be able to create a CandleInterval from a string', () =>
	{
		const interval = CandleInterval.fromString('5m')
		expect(interval.unit).toBe(CandleInterval.IntervalUnit.MINUTE)
		expect(interval.amount).toBe(5)
	})

	test('should re-create a CandleInterval from its toString representation', () =>
	{
		for (const unit of Object.values((CandleInterval as any).IntervalUnit))
		{
			const interval = new CandleInterval(unit as CandleInterval.IntervalUnit, 1)
			expect(CandleInterval.fromString(interval.toString())).toEqual(interval)
		}
	})

	test('should throw an error if the string is too short', () =>
	{
		expect(() => CandleInterval.fromString('')).toThrowError()
	})

	test('should throw an error if the string has an invalid interval', () =>
	{
		expect(() => CandleInterval.fromString('5x')).toThrowError()
	})

	test('should throw an error if the string has an invalid amount', () =>
	{
		expect(() => CandleInterval.fromString('-1m')).toThrowError()
		expect(() => CandleInterval.fromString(`${Math.sqrt(-1)}s`)).toThrowError()
	})
})
