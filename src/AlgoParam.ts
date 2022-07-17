import AlgoVar from "./AlgoVar"

/**
 * A tunable parameter for a trading algorithm. Must be a number.
 */
class AlgoParam extends AlgoVar<number>
{
	min: number // The minimum value of the parameter
	max: number // The maximum value of the parameter
	step: number // The step size of the parameter

	/**
	 * Creates a new AlgoParam.
	 * @param name The name of the parameter.
	 * @param value The initial value of the parameter.
	 * @param min The minimum value of the parameter.
	 * @param max The maximum value of the parameter.
	 * @param step The step size of the parameter, for use when tuning.
	 */
	constructor(name : string, value : number, min : number, max : number, step : number)
	{
		super(name, value)
		this.min = min
		this.max = max
		this.step = step

		if (this.max < this.min)
			throw new Error(`Max value (${this.max}) must be greater than or equal to min value (${this.min})`)
	}

	/**
	 * Gets the value of this parameter.
	 * @returns The value of this parameter.
	 */
	get value() : number
	{
		return super.value
	}

	/**
	 * Sets the value of this parameter,
	 * then clamps it to the min/max range.
	 * @param value The new value of the parameter.
	 */
	set value(value : number)
	{
		super.value = value
		this.clamp()
	}

	/**
	 * Increments the value of this parameter by the step size,
	 * then clamps it to the min/max range. Updates the value
	 * internally, and returns it.
	 * @returns The new value.
	 */
	inc() : number
	{
		super.value += this.step
		return this.clamp()
	}

	/**
	 * Decrements the value of this parameter by the step size,
	 * then clamps it to the min/max range. Updates the value
	 * internally, and returns it.
	 * @returns The new value.
	 */
	dec() : number
	{
		super.value -= this.step
		return this.clamp()
	}

	/**
	 * Clamps the value of this parameter to the min/max range.
	 * Updates the value internally, and returns it.
	 * @returns The new value.
	 */
	clamp() : number
	{
		if (super.value > this.max)
			super.value = this.max
		else if (super.value < this.min)
			super.value = this.min

		return super.value
	}
}

export default AlgoParam
