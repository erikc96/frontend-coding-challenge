export interface EarthquakeProperties {
  [k: string]: string | number | null;
  mag: number;
  place: string;
  time: number;
  url: string;
  status: string; // TODO Do I need this?
  type: string;
  title: string;
  magType: string;
  gap: number;
  rms: number;
  dmin: number;
}

export interface Earthquake {
  type: string;
  properties: EarthquakeProperties;
  geometry: {
    coordinates: [number, number, number];
  };
  id: string;
}

export interface EarthquakeCollection {
  type: string;
  metadata: {
    generated: number;
    url: string;
    title: string;
    status: number;
    api: string;
    count: number;
  };
  features: Earthquake[];
}

export type Country = {
  type: string;
  properties: { ADMIN: string };
  geometry: { coordinates: [number, number][][][] };
};

export type CountryCollection = { type: string; features: Country[] };

export interface RawData {
  earthquakeCollection: EarthquakeCollection;
  countryCollection: CountryCollection;
  initialized: boolean;
}

export interface Filters {
  fuzzy?: string;
  country?: string;
  magnitude?: number;
  range?: { startDate: Date; endDate: Date };
}

export interface MapState {
  latitude: number;
  longitude: number;
  zoom: number;
  ref: any;
}

export interface Selected {
  earthquakeId: string | null;
}

export interface GlobalState {
  earthquakeCollection: EarthquakeCollection;
  countryCollection: CountryCollection;
  earthquakes: Earthquake[];
  countries: Country[];
  initialized: boolean;
  filteredEarthquakes: Earthquake[];
  filters: Filters;
  setFilters: (filters: Filters) => void;
  mapState: MapState;
  setMapState: (mapState: MapState) => void;
  filteredEarthquakeIds: string[];
  earthquakesById: { [k: string]: Earthquake };
  selected: Selected;
  setSelected: (selected: Selected) => void;
}
