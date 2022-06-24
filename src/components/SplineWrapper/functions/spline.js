import * as d3 from "d3";

/**
 * @description Catmull-rom spline interpolator from 
 * https://observablehq.com/@severo/catmull-rom-spline-interpolator
 */
const interpolateCatmullRom = () => {
  // adapted from d3.interpolateBasis: https://github.com/d3/d3-interpolate/blob/master/src/basis.js

  function deltaT(u, v, alpha) {
    let sum = 0;
    for (let i = 0; i < u.length; i++) {
      sum += (u[i] - v[i]) * (u[i] - v[i]);
    }
    return Math.pow(sum, alpha / 2);
  }
  function sum(fu, u, fv, v, div = 1) {
    return u.map((ui, i) => (fu * ui + fv * v[i]) / div);
  }
  function catmullRom(tt, v0, v1, v2, v3, alpha) {
    var t0 = 0,
      t1 = deltaT(v1, v0, alpha / 2) + t0,
      t2 = deltaT(v2, v1, alpha / 2) + t1,
      t3 = deltaT(v3, v2, alpha / 2) + t2,
      t = (1 - tt) * t1 + tt * t2,
      a1 = sum(t1 - t, v0, t - t0, v1, t1 - t0),
      a2 = sum(t2 - t, v1, t - t1, v2, t2 - t1),
      a3 = sum(t3 - t, v2, t - t2, v3, t3 - t2),
      b1 = sum(t2 - t, a1, t - t0, a2, t2 - t0),
      b2 = sum(t3 - t, a2, t - t1, a3, t3 - t1),
      c = sum(t2 - t, b1, t - t1, b2, t2 - t1);
    return c;
  }

  return (function custom(alpha) {
    function interpolateCatmullRom(values) {
      // values must be an array of arrays of equal length (2 for 2D, 3 for 3D)
      // we accept scalars for 1D, in that case we return a scalar
      const scalar = !Array.isArray(values[0]);
      const arr = scalar ? (u) => [u] : (u) => u;
      const unarr = scalar ? (u) => u[0] : (u) => u;
      var n = values.length - 1;
      return function (t) {
        var i =
            t <= 0 ? (t = 0) : t >= 1 ? ((t = 1), n - 1) : Math.floor(t * n),
          v1 = arr(values[i]),
          v2 = arr(values[i + 1]),
          // should we throw if v1.length !== v2.length?
          v0 = i > 0 ? arr(values[i - 1]) : sum(2, v1, -1, v2),
          v3 = i < n - 1 ? arr(values[i + 2]) : sum(2, v2, -1, v1);
        return unarr(catmullRom((t - i / n) * n, v0, v1, v2, v3, alpha));
      };
    }

    interpolateCatmullRom.alpha = function (alpha) {
      return custom(+alpha);
    };

    return interpolateCatmullRom;
  })(1);
};

/**
 * @description Create individual curved line for each pair of point 
 * using catmull-rom spline formula
 * @param  {{from:number[], to:number[], properties?:object}[]} lines
 */
const createSpline = (lines) => {
	const linesCount = lines.length
	let interpolatedCount = 100
	let positions = [...lines.map(line => line.from), lines[lines.length - 1].to]

	interpolatedCount *= linesCount
	const interpolated = d3.quantize(interpolateCatmullRom()(positions), interpolatedCount);
	const lineStrings = []

	for(let i=0;i<linesCount;i++){
		const line = lines[i]
		lineStrings.push({
			type: "Feature",
			properties: { ...line.properties } ?? {},
			geometry: {
			  type: "LineString",
			  coordinates: interpolated.slice(interpolatedCount/linesCount*i, interpolatedCount/linesCount*(i + 1))
			}
		  })
	}
  
	return lineStrings
  };

export { createSpline };
