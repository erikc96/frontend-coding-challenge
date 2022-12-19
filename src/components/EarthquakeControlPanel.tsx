import { useGlobalStateContext } from "../hooks";
import { Country } from "../types";
import { centerOnCountry, getCountryByName } from "../utils";
import { DateRangeSelector } from "./DateRangeSelector";

export const EarthquakeControlPanel = () => {


  const { countries, filters, setFilters, mapState, setMapState } = useGlobalStateContext();

  return (
    <div className="Earthquake-Control-Panel">
      <DateRangeSelector filters={filters} setFilters={setFilters} />
      <div>
        <label>Country</label>
        <select value={filters.country} onChange={(e) => {
          setFilters({ ...filters, country: e.target.value });
          const country = getCountryByName(e.target.value, countries)
          centerOnCountry(country, mapState, setMapState)
        }}>
          <option value="">All</option>
          {countries.map((country: Country) => <option value={country.properties.ADMIN}>{country.properties.ADMIN}</option>)}
        </select>
      </div>
      <div>
        <label>Magnitude (&gt;=)</label>
        <select value={filters.magnitude} onChange={(e) => { setFilters({ ...filters, magnitude: Number(e.target.value) }); }}>
          <option value="0">0</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((magnitude) => <option value={magnitude}>{magnitude}</option>)}
        </select>
      </div>
    </div>
  )
}
