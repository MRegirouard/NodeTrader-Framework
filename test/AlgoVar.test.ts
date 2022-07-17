import AlgoVar from "../src/AlgoVar"
import { VarChangedEvent } from "../src/AlgoVar"

describe('AlgoVar', () =>
{
    test('should be able to have a number type', () =>
    {
        const algoVar = new AlgoVar<number>('myVar', 100)
        expect(algoVar)
        expect(algoVar.value).toBe(100)
        expect(algoVar.name).toBe('myVar')
    })

    test('should be able to have string type', () =>
    {
        const algoVarStr = new AlgoVar<string>('myStrVar', 'str')
        expect(algoVarStr)
        expect(algoVarStr.value).toBe('str')
        expect(algoVarStr.name).toBe('myStrVar')
    })

    test('should be able to have Date type', () =>
    {
        const algoVarDate = new AlgoVar<Date>('myDateVar', new Date())
        expect(algoVarDate)
        expect(algoVarDate.value).toBeInstanceOf(Date)
        expect(algoVarDate.name).toBe('myDateVar')
    })
})

describe('VarChangedEvent', () =>
{
    test('should be able to create a VarChangedEvent', () =>
    {
        const algoVar = new AlgoVar<number>('myVar', 100)
        const date = new Date()
        const varChangedEvent = new VarChangedEvent(algoVar, 100, 200, date)
        expect(varChangedEvent)
        expect(varChangedEvent.algoVar).toBe(algoVar)
        expect(varChangedEvent.oldValue).toBe(100)
        expect(varChangedEvent.newValue).toBe(200)
        expect(varChangedEvent.date).toBe(date)
    })

    test('should automatically set the newValue and date if not provided', () =>
    {
        const algoVar = new AlgoVar<number>('myVar', 200)
        const varChangedEvent = new VarChangedEvent(algoVar, 100)
        expect(varChangedEvent)
        expect(varChangedEvent.algoVar).toBe(algoVar)
        expect(varChangedEvent.oldValue).toBe(100)
        expect(varChangedEvent.newValue).toBe(200)
        expect(varChangedEvent.date).toBeInstanceOf(Date)
    })
})

describe('AlgoVar.value', () =>
{
    test('should set/get the value of the AlgoVar', () =>
    {
        const algoVar = new AlgoVar('myVar', 100)
        algoVar.value = 200
        expect(algoVar)
        expect(algoVar.value).toBe(200)
    })

    test('should emit a changed event when the value is changed', () =>
    {
        const algoVar = new AlgoVar('myVar', 100)
        const callback = jest.fn((event: VarChangedEvent<number>) =>
        {
            expect(event)
            expect(event.algoVar).toBe(algoVar)
            expect(event.oldValue).toBe(100)
            expect(event.newValue).toBe(200)
            expect(event.date).toBeInstanceOf(Date)
        })

        algoVar.on('changed', callback)
        algoVar.value = 200
        expect(callback).toHaveBeenCalled()
    })
})
