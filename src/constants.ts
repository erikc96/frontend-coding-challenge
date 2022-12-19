export const EMPTY_COUNTRY = {
  type: "Feature",
  properties: { ADMIN: "" },
  geometry: { coordinates: [] }
};

export const EMPTY_COLLECTION = {
  type: 'FeatureCollection',
  features: [],
  metadata: {
    generated: 0,
    url: '',
    title: '',
    status: 0,
    api: '',
    count: 0
  }
};

export const initialMapState = { latitude: 42.35, longitude: -70.9, zoom: 3, ref: null };
