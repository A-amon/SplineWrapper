import PropType from "prop-types";
import { useState, useEffect } from "react";
import { Source, Layer } from "react-map-gl";
import { createArrow } from "./functions/linedArrow";
import { createSpline } from "./functions/spline";

/**
 * @description Wrapper component for [react-map-gl](https://github.com/visgl/react-map-gl) Source component. 
 * Create curved lines for positions defined in lines prop.
 * Add arrow to end of lines
 * @param {{
 * 		children:import("react-map-gl").Source,
 * 		hasArrow:boolean,
 * 		iconImage: string,
 * 		lines:{from:number[], to:number[], properties?:object}[],
 * }}
 */
const SplineWrapper = ({ children, hasArrow, iconImage, lines }) => {
  const [features, setFeatures] = useState([]);

  const sourceComponent = Array.isArray(children)
    ? children.filter((child) => child.type === Source)
    : children;

  const { data: featureCollection } = sourceComponent.props;

  useEffect(() => {
    setFeatures([]);
    let splineLineFeatures = [];
    const arrowFeatures = [];

    /**
     * Interpolate between a pair of lines
     * Use catmull rom formula
     */
    if (lines && lines.length > 0) {
		splineLineFeatures = createSpline(lines)
    }

    /**
     * Add arrow to end of each line
     * Arrow lines to line's direction
     */
    if (hasArrow) {
      const { features } = featureCollection;
      const existingLines = features.filter(
        (feature) => feature.geometry.type === "LineString"
      );
      const lines = [...existingLines, ...splineLineFeatures];

      for (const line of lines) {
        const {
          geometry: { coordinates }
        } = line;
        const lastCoordinateIndex = coordinates.length - 1;

        arrowFeatures.push(
          createArrow(
            coordinates[lastCoordinateIndex - 1],
            coordinates[lastCoordinateIndex]
          )
        );
      }
    }

    setFeatures((features) => [
      ...features,
      ...splineLineFeatures,
      ...arrowFeatures
    ]);
  }, [featureCollection, lines, hasArrow]);

  const getFeatureCollection = (features) => {
    return {
      ...featureCollection,
      features: [...featureCollection.features, ...features]
    };
  };

  return (
    <Source {...sourceComponent.props} data={getFeatureCollection(features)}>
      {sourceComponent.props.children}
      {hasArrow && iconImage ? (
        <Layer
          type="symbol"
          filter={["==", "$type", "Point"]}
          layout={{
            "icon-image": iconImage,
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
  hasArrow: PropType.bool,
  iconImage: PropType.string,
  lines: PropType.arrayOf(PropType.object)
};

export default SplineWrapper;
