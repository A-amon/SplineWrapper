import { useState, useEffect, useRef } from "react";
import Map, { Source, Layer } from "react-map-gl";
import SplineWrapper from "./components/SplineWrapper";
import { getDarkColor } from "./functions/utilities";
import locations from "./locations.json";

const TOKEN = "";	// ADD TOKEN HERE

export default function App() {
  const mapRef = useRef();

  const [lines, setLines] = useState([]);

  useEffect(() => {
    const lines = [];
    for (let i = 0; i < locations.length - 1; i++) {
      lines.push({
        from: [locations[i].position[1], locations[i].position[0]],
        to: [locations[i + 1].position[1], locations[i + 1].position[0]],
        properties: {
          color: getDarkColor()
        }
      });
    }
    setLines(lines);
  }, []);

  // Load arrow icon for symbol layer
  const handleMapLoad = () => {
    const map = mapRef.current.getMap();
    map.loadImage("https://i.imgur.com/LcIng3L.png", (error, image) => {
      if (!map.hasImage("arrow")) {
        map.addImage("arrow", image);
      }
      return null;
    });
  };

  return (
    <div style={{ height: "100vh" }}>
      {locations.length > 0 && lines.length > 0 && (
        <Map
          ref={mapRef}
          mapboxAccessToken={TOKEN}
          mapStyle=""	// ADD MAP STYLE HERE
          initialViewState={{
            latitude: lines[0].from[0],
            longitude: lines[0].from[1],
            zoom: 1
          }}
          onLoad={handleMapLoad}
        >
          <SplineWrapper
            lines={lines}
            hasArrow={true}
            iconImage="arrow"
          >
            <Source
              type="geojson"
              data={{
                type: "FeatureCollection",
                features: []
              }}
            >
              <Layer
                type="line"
                paint={{
                  "line-dasharray": [2, 3],
                  "line-color": ["get", "color"]
                }}
              />
            </Source>
          </SplineWrapper>
        </Map>
      )}
    </div>
  );
}
