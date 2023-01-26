import { EventEmitter } from 'events'

/**
 * Stores data reguarding an AlgoVar change, storing the AlgoVar,
 * the old and new values, and the date the change occurred on.
 */
class VarChangedEvent<T>
{
	/**
	 * Creates a new VarChangedEvent, storing the AlgoVar, the old value,
	 * (optionally) the new value, and (optionally) the date the change
	 * occurred on. If no new value is provided, the current value is used.
	 * If no date is provided, the current date is used.
	 * @param algoVar The AlgoVar that changed.
	 * @param oldValue The value prior to the change.
	 * @param newValue The new value of the AlgoVar. Defaults to algoVar.value.
	 * @param date The date the change occurred on. Defaults to new Date().
	 */
	public constructor(public readonly algoVar: AlgoVar<T>, public readonly oldValue: T,
		public readonly newValue: T = algoVar.value, public readonly date: Date = new Date())
	{}
}

/**
 * A variable that can be used to store and retrieve data for the
 * trading algorithm.
 *
 * Emits a 'changed' event when the value is changed to a new value,
 * to allow for logging and storing the value in a database.
 */
class AlgoVar<T> extends EventEmitter
{
	private _value: T // The current value of the variable

	/**
	 * Create a new AlgoVar, with the given name and initial value.
	 * @param name The name of the variable.
	 * @param value The initial value of the variable.
	 */
	public constructor(public readonly name: string, value: T)
	{
		super()
		this._value = value
	}

	/**
	 * Get the current value of the variable.
	 * @returns The current value of the variable.
	 */
	public get value(): T
	{
		return this._value
	}

	/**
	 * Set the current value of the variable.
	 * Emits a 'changed' event with the old value and the new value,
	 * regardless of whether the value actually changed.
	 * @param value The new value of the variable.
	 */
	public set value(value: T)
	{
		const changeEvent = new VarChangedEvent(this, this.value, value)
		this._value = value
		this.emit('changed', changeEvent)
	}
}

export { AlgoVar, VarChangedEvent }
export default AlgoVar
