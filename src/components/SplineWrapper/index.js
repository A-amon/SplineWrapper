import PropType from "prop-types";
import React, { useState, useEffect } from "react";
import { Source, Layer } from "react-map-gl";
import { createArrow } from "./functions/linedArrow";
import { createSpline } from "./functions/spline";

/**
 * @description Wrapper component for [react-map-gl](https://github.com/visgl/react-map-gl) Source component. 
 * Create curved lines for positions defined in lines prop.
 * Add arrows to start | center | end of lines
 * @typedef {object} arrow
 * @property {string} icon 
 * @property {"start" | "center" | "end"} [position="end"]
 * 
 * @param {object} prop
 * @param {import("react-map-gl").Source} prop.children
 * @param {arrow} [prop.arrow]
 * @param {{from:number[], to:number[], properties?:object}[]} [prop.lines]
 * 
 */
const SplineWrapper = ({ children, arrow, lines }) => {
	const [featureCollection, setFeatureCollection] = useState()
	const [features, setFeatures] = useState([]);

	const sourceComponent = Array.isArray(children)
		? children.filter((child) => child.type === Source)
		: children;

	const { data } = sourceComponent.props;

	if(!featureCollection){
		//Handle URL data
		//Fetch from URL
		if(typeof(data) === "string"){
			async function getData(){
				fetch(data)
				.then(res => res.json())
				.then(data => setFeatureCollection(data))
			}

			getData()
		}
		//Handle GeoJSON data
		else if(typeof(data) === "object" && data.features){
			setFeatureCollection(data)
		}
	}


	useEffect(() => {
		setFeatures([]);
		let splineLineFeatures = [];
		const arrowFeatures = [];

		/**
		 * Interpolate between pairs of lines
		 */
		if (lines && lines.length > 0) {
			splineLineFeatures = createSpline(lines)
		}

		/**
		 * Add arrow to each line
		 * Arrow points to line's direction
		 */
		if (arrow && featureCollection) {
			const { features } = featureCollection;
			const existingLines = features.filter(
				(feature) => feature.geometry.type === "LineString"
			);
			const lines = [...existingLines, ...splineLineFeatures];

			for (const line of lines) {
				const {
				geometry: { coordinates }
				} = line;

				const {position} = arrow
				let positionIndex = coordinates.length - 1

				if(position === "start"){
					positionIndex = 1
				}
				else if(position === "center"){
					positionIndex = coordinates.length / 2
				}

				arrowFeatures.push(
				createArrow(
					coordinates[positionIndex - 1],
					coordinates[positionIndex]
				)
				);
			}
		}

		setFeatures((features) => [
		...features,
		...splineLineFeatures,
		...arrowFeatures
		]);
	}, [featureCollection, lines, arrow]);

	const getFeatureCollection = (features) => {
		if(featureCollection){
			return {
				...featureCollection,
				features: [...featureCollection.features, ...features]
				};
		}
		else{
			return {
				type:"FeatureCollection",
				features: [...features]
			}
		}
	};

	return (
		<Source {...sourceComponent.props} data={getFeatureCollection(features)}>
		{sourceComponent.props.children}
		{arrow && arrow.icon? (
			<Layer
			type="symbol"
			filter={["==", ["get", "isArrow"], true]}
			layout={{
				"icon-image": arrow.icon,
				"icon-rotate": ["get", "angle"],
				"icon-size": 0.045,
				"icon-rotation-alignment": "map",
				visibility: "visible"
			}}
			/>
		) : null}
		</Source>
	);
};

SplineWrapper.propTypes = {
	children: PropType.oneOfType([PropType.arrayOf(PropType.node), PropType.node]),
	arrow:PropType.object,
	lines: PropType.arrayOf(PropType.object)
};

export default SplineWrapper;
