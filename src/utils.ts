import { EMPTY_COUNTRY } from "./constants";
import * as turfHelper from "@turf/helpers"
import booleanPointInPolygon from "@turf/boolean-point-in-polygon"
import * as turf from '@turf/turf';
import { Country, Earthquake, GlobalState } from "./types";

export const getCountryByName = (name: string, countries: Country[]) => {
  return countries.find((country: any) => country.properties.ADMIN === name) || [EMPTY_COUNTRY][0]; // TODO any
}

export const centerOnCountry = (country: Country, mapState: GlobalState["mapState"], setMapState: GlobalState["setMapState"]) => {
  const center = turf.centroid(country as any)
  const [longitude, latitude] = center.geometry.coordinates
  setMapState({ ...mapState, latitude, longitude, zoom: 3 });
}

export const isEarthquakeInCountry = (earthquake: Earthquake, country?: Country) => {
  if (!country) return false
  // checks if pooint is in polygon representing country using d3
  // Check if earthquake occured in specified country using jsts
  // convert the OpenLayers geometry to a JSTS geometry
  return booleanPointInPolygon(earthquake, country)
}


export function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  timeout: number,
): (...args: Params) => void {
  let timer: NodeJS.Timeout
  return (...args: Params) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
  }
}
