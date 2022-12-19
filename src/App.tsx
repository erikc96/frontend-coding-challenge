import React, { useMemo, useRef, useState } from "react";
import logo from "./logo.svg";
import ReactDOMServer from "react-dom/server";
import "./App.css";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl, { Point } from "mapbox-gl";
import * as turf from "@turf/turf";
import { Map } from "./components/Map";
import { EarthquakeList } from "./components/EarthquakeList";
import { EarthquakeControlPanel } from "./components/EarthquakeControlPanel";
import { EarthquakeDetails } from "./components/EarthquakeDetails";
import { GlobalStateContext } from "./contexts/GlobalStateContext";
import { useGlobalState, useSelected } from "./hooks";

function App() {
  const globalState = useGlobalState();
  const { selected, mapState, earthquakesById, setMapState } = globalState;
  useSelected(globalState);
  const selectedEarthquake = selected.earthquakeId
    ? earthquakesById[selected.earthquakeId]
    : null;

  console.log("App.tsx", { globalState });
  return (
    <div className="parent">
      <GlobalStateContext.Provider value={globalState}>
        <header className="section coral Header">Earthquake Map</header>
        <div className="left-side section blue"></div>
        <main className="section green">
          <Map />
          <EarthquakeControlPanel />
          <div className="Main-Earthquake-Details-Container">
            <EarthquakeDetails earthquake={selectedEarthquake} />
          </div>
          <EarthquakeList />
        </main>
        <div className="right-side section yellow"></div>
        <footer className="section coral">
          <div className="Author-Attributes">
            <div className="Author-Attribute">
              <div className="Author-Attribute-label">Author</div>
              <div className="Author-Attribute-value">Erik Craigo</div>
            </div>
            <div className="Author-Attribute">
              <div className="Author-Attribute-label">Date</div>
              <div className="Author-Attribute-value">2022-12-18</div>
            </div>
            <div className="Author-Attribute">
              <div className="Author-Attribute-label">Version</div>
              <div className="Author-Attribute-value">1.0.0</div>
            </div>
            <div className="Author-Attribute">
              <div className="Author-Attribute-label">License</div>
              <div className="Author-Attribute-value">MIT</div>
            </div>
          </div>
        </footer>
      </GlobalStateContext.Provider>
    </div>
  );
}

export default App;
