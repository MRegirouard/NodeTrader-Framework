import AlgoParam from "../src/AlgoParam"
import AlgoVar from "../src/AlgoVar"
import { VarChangedEvent } from "../src/AlgoVar"
import { EventEmitter } from "events"

var algoParam: AlgoParam

beforeEach(() =>
{
    algoParam = new AlgoParam("myParam", 50, 0, 100, 10)
})

describe('AlgoParam', () =>
{
    test('Should create a new AlgoParam', () =>
    {
        expect(algoParam)
        expect(algoParam).toBeInstanceOf(AlgoVar)
        expect(algoParam).toBeInstanceOf(EventEmitter)
        expect(algoParam.name).toBe('myParam')
        expect(algoParam.value).toBe(50)
        expect(algoParam.min).toBe(0)
        expect(algoParam.max).toBe(100)
        expect(algoParam.step).toBe(10)
    })
})

describe('AlgoParam.value', () =>
{
    test('Should set/get the value of the AlgoParam', () =>
    {
        expect(algoParam.value).toBe(50)
        algoParam.value = 60
        expect(algoParam.value).toBe(60)
    })

    test('Should clamp the value if it is too high', () =>
    {
        algoParam.value = 101
        expect(algoParam.value).toBe(100)
    })

    test('Should clamp the value if it is too low', () =>
    {
        algoParam.value = -1
        expect(algoParam.value).toBe(0)
    })

    test('Should emit a changed event when the value is changed', () =>
    {
        const callback = jest.fn((event: VarChangedEvent<number>) =>
        {
            expect(event)
            expect(event.algoVar).toBe(algoParam)
            expect(event.oldValue).toBe(50)
            expect(event.newValue).toBe(60)
            expect(event.date).toBeInstanceOf(Date)
        })

        algoParam.on('changed', callback)
        algoParam.value = 60
    })
})

describe('AlgoParam.inc', () =>
{
    test('Should increment the value of the AlgoParam by the step size', () =>
    {
        expect(algoParam.inc()).toBe(60)
        expect(algoParam.value).toBe(60)
    })

    test('Should clamp the value if it is too high', () =>
    {
        algoParam.value = 91
        expect(algoParam.inc()).toBe(100)
        expect(algoParam.value).toBe(100)
    })
})

describe('AlgoParam.dec', () =>
{
    test('Should decrement the value of the AlgoParam by the step size', () =>
    {
        expect(algoParam.dec()).toBe(40)
        expect(algoParam.value).toBe(40)
    })

    test('Should clamp the value if it is too low', () =>
    {
        algoParam.value = 9
        expect(algoParam.dec()).toBe(0)
        expect(algoParam.value).toBe(0)
    })
})
