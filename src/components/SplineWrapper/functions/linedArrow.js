/**
 * @description Add arrow to end of line.
 * Arrow points to the line direction
 * @param  {number[]} posFrom
 * @param  {number[]} posTo
 */
const createArrow = (posFrom, posTo) => {
	const getFlipAngle = () => {
		if((posTo[1] > posFrom[1] && posTo[0] < posFrom[0]) || 
		(posTo[1] < posFrom[1] && posTo[0] < posFrom[0])){
			return 180
		}
		return 0
	}

	return {
		type: "Feature",
		properties: {
		// tangent rule to calculate rotation of angle
		// based on destination position from source position
		angle:
			((Math.atan((posTo[1] - posFrom[1]) / (posTo[0] - posFrom[0])) *
			-1 * 180) / Math.PI) + getFlipAngle()
		},
		geometry: {
		type: "Point",
		coordinates: [...posTo]
		}
	};
};

export { createArrow };
