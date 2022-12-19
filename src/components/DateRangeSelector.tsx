import { DateRangePicker } from 'react-date-range';
import { GlobalState } from "../types";

export const DateRangeSelector = ({ filters, setFilters }: { filters: GlobalState["filters"]; setFilters: GlobalState["setFilters"]; }) => {
  const selectionRange = {
    startDate: filters && filters.range?.startDate ? new Date(filters.range.startDate) : new Date(),
    endDate: filters && filters.range?.endDate ? new Date(filters.range.endDate) : new Date(),
    key: 'selected',
  }

  return (
    <div>
      <DateRangePicker
        ranges={[selectionRange]}
        onChange={(ranges) => { console.log("click daternage", { filters }, { ...filters, range: ranges.selected }); setFilters({ ...filters, range: ranges.selected }) }}
      />
    </div>
  )
}
