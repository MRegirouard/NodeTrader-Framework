import { EventEmitter } from "events"

/**
 * Stores data reguarding an AlgoVar change, storing the AlgoVar,
 * the old and new values, and the date the change occurred on.
 */
class VarChangedEvent<T>
{
	public readonly algoVar: AlgoVar<T> // The AlgoVar that changed
	public readonly newValue: T // The new value of the AlgoVar. Stored so that
								// this event can be used after multiple changes
								// to the AlgoVar and still represents the change.
	public readonly oldValue: T // The value prior to the change
	public readonly date: Date // The date the change occurred on

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
	constructor(algoVar: AlgoVar<T>, oldValue: T, newValue: T = null, date: Date = null)
	{
		this.algoVar = algoVar
		this.oldValue = oldValue
		this.newValue = newValue || algoVar.value
		this.date = date || new Date()
	}
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
	public readonly name : string // The name of the variable
	private _value : T // The current value of the variable

	/**
	 * Create a new AlgoVar, with the given name and initial value.
	 * @param name The name of the variable.
	 * @param value The initial value of the variable.
	 */
	constructor(name : string, value : T)
	{
		super()
		this.name = name
		this.value = value
	}

	/**
	 * Get the current value of the variable.
	 * @returns The current value of the variable.
	 */
	get value() : T
	{
		return this._value
	}

	/**
	 * Set the current value of the variable.
	 * Emits a 'changed' event with the old value and the new value,
	 * regardless of whether the value actually changed.
	 * @param value The new value of the variable.
	 */
	set value(value : T)
	{
		const changeEvent = new VarChangedEvent(this, this.value, value)
		this._value = value
		this.emit('changed', changeEvent)
	}
 }

export { AlgoVar, VarChangedEvent }
export default AlgoVar