import React from "react";
import { EMPTY_COLLECTION, initialMapState } from "../constants";
import { GlobalState } from "../types";

export const GlobalStateContext = React.createContext<GlobalState>({
  earthquakeCollection: EMPTY_COLLECTION,
  countryCollection: EMPTY_COLLECTION,
  initialized: false,
  earthquakes: [],
  countries: [],
  filteredEarthquakes: [],
  filters: {},
  setFilters: () => {},
  mapState: initialMapState,
  setMapState: () => {},
  filteredEarthquakeIds: [],
  earthquakesById: {},
  selected: { earthquakeId: null },
  setSelected: () => {
    console.log("Error initializing context");
  },
});
