import React, { useMemo, useState } from "react"
import { EMPTY_COLLECTION, initialMapState } from "../constants"
import { GlobalStateContext } from "../contexts/GlobalStateContext"
import { Country, Earthquake, Filters, GlobalState, MapState, RawData, Selected } from "../types"
import { getCountryByName, isEarthquakeInCountry } from "../utils"
export const useGlobalStateContext = () => {
  return (
    React.useContext(GlobalStateContext)
  )
}


// Function that handles relocating viewport to selected Earthquake on system start
// God Component
export const useSelected = ({ setSelected, selected, mapState, earthquakesById, setMapState, filteredEarthquakeIds }: GlobalState) => {
  React.useEffect(() => {
    if (selected.earthquakeId) {
      if (!filteredEarthquakeIds.includes(selected.earthquakeId)) {
        setSelected({ ...selected, earthquakeId: null })
      }
    }
  }, [filteredEarthquakeIds])
  React.useEffect(() => {
    if (selected.earthquakeId) {
      if (filteredEarthquakeIds.includes(selected.earthquakeId)) {
        const earthquake = earthquakesById[selected.earthquakeId];
        console.log("useSelected useEffect", { earthquake })
        const [longitude, latitude] = earthquake.geometry.coordinates;
        const newMapState = { ...mapState, latitude, longitude, zoom: 8 };
        setMapState(newMapState);
      }
    }
  }, [selected.earthquakeId])
}

export const usePagination = (data: any[], pageSize: number) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const maxPage = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const goToNextPage = () => setCurrentPage(currentPage + 1);
  const goToPreviousPage = () => setCurrentPage(currentPage - 1);
  const goToPage = (page: number) => setCurrentPage(page);
  React.useEffect(() => {
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage);
    }
  }, [maxPage])
  const getPaginationProps = () => {
    return {
      currentPage,
      maxPage,
      goToNextPage,
      goToPreviousPage,
      goToPage,
    }
  }
  return [paginatedData, getPaginationProps] as const;
}



// react hook which reads json files in data folder and creates a context with the data
// useGlobalState interface
interface UseGlobalState {
  (): GlobalState
}
export const useGlobalState: UseGlobalState = () => {
  const [selected, setSelected] = React.useState<Selected>({ earthquakeId: null });
  const [rawData, setRawData] = React.useState<RawData>({ initialized: false, earthquakeCollection: EMPTY_COLLECTION, countryCollection: EMPTY_COLLECTION });
  const [mapState, setMapState] = React.useState<MapState>(initialMapState);
  console.log("useGlobalState", { selected })

  React.useEffect(() => {
    const fetchData = async () => {
      const countryCollection = await (await fetch('data/countries.geojson')).json();
      const earthquakeCollection = await (await fetch('data/earthquakes.geojson')).json();
      setRawData({ countryCollection, earthquakeCollection, initialized: true });
    };

    fetchData();
  }, []);

  const out = { earthquakes: rawData.earthquakeCollection?.features || [], countries: rawData.countryCollection?.features || [], initialized: rawData.initialized };

  const { filteredEarthquakes, filters, setFilters, filteredEarthquakeIds, earthquakesById } = useEarthquakes({ earthquakes: out.earthquakes, countries: out.countries, initialized: out.initialized });
  return { ...out, ...rawData, filteredEarthquakes, filters, setFilters, mapState, setMapState, filteredEarthquakeIds, earthquakesById, selected, setSelected }
}


// Component that returns a list of Earthquakes in recent history, with geojson data
// Allows for filtering by magnitude and country
// Returns a list of earthquakes
// Returns a list
// TODO: Add Filtering by country
// TODO: Add filtering by magnitutde
// type for useEarthquakes props
interface UseEarthquakesProps {
  earthquakes: Earthquake[];
  countries: Country[];
  initialized: boolean;
}

interface UseEarthquakesReturn {
  filteredEarthquakes: Earthquake[];
  filters: { country?: string; magnitude?: number };
  setFilters: (filters: { country?: string; magnitude?: number }) => void;
  filteredEarthquakeIds: string[];
  earthquakesById: { [key: string]: Earthquake };
}

type UseEarthquakes = (props: UseEarthquakesProps) => UseEarthquakesReturn;
const useEarthquakesFiltersInitialState = {}
const useEarthquakes: UseEarthquakes = ({ earthquakes, countries, initialized }) => {

  const [filters, setFilters] = useState<Filters>(useEarthquakesFiltersInitialState);

  const earthquakesById = useMemo(() => earthquakes.reduce((acc, earthquake) => {
    return { ...acc, [earthquake.id]: earthquake }
  }, {}), [earthquakes] as const);


  const filteredEarthquakes = useMemo(() => (
    !initialized ? [] :
      earthquakes.filter((earthquake) => filterByCountry(earthquake, countries, filters.country))
        .filter((earthquake) => filterByMagnitude(earthquake, filters.magnitude)))
    .filter((earthquake) => filterWithDateRange(earthquake, filters.range || {})),
    [earthquakes, countries, filters])

  const filteredEarthquakeIds = filteredEarthquakes.map((earthquake) => (earthquake.id))


  return { filteredEarthquakes, filters, setFilters, filteredEarthquakeIds, earthquakesById };

}

// Filters out eaarthquakes that did not happen within a date range (inclusive)
const filterWithDateRange = (earthquake: Earthquake, { startDate, endDate }: { startDate?: Date, endDate?: Date }) => {
  if (startDate) {
    if (new Date(earthquake.properties.time) < startDate) {
      return false;
    }
  }
  if (endDate) {
    if (new Date(earthquake.properties.time) > endDate) {
      return false
    }
  }
  return true
}

const filterByCountry = (earthquake: Earthquake, countries: Country[], countryName?: string) => {
  if (!countryName) return true
  const country = getCountryByName(countryName, countries);
  return isEarthquakeInCountry(earthquake, country);
}

const filterByMagnitude = (earthquake: Earthquake, magnitude?: number) => {
  if (!magnitude) return true
  return earthquake.properties.mag > magnitude;
}

