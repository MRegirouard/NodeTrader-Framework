import Candle from "../src/Candle"
import moment from "moment"

describe('Candle', () =>
{
    test('should create a new Candle', () =>
    {
        const date: moment.Moment = moment()
        const open: number = 15.18
        const high: number = 15.27
        const low: number = 15.17
        const close: number = 15.25
        const volume: number = 1689

        const candle = new Candle(date, open, high, low, close, volume)
        expect(candle).toBeInstanceOf(Candle)
        expect(candle.date).toBe(date)
        expect(candle.open).toBe(open)
        expect(candle.high).toBe(high)
        expect(candle.low).toBe(low)
        expect(candle.close).toBe(close)
        expect(candle.volume).toBe(volume)
    })
})
