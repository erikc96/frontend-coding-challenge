import { DateRangePicker } from "rsuite";
import { GlobalState } from "../types";

export const DateRangeSelector = ({
  filters,
  setFilters,
}: {
  filters: GlobalState["filters"];
  setFilters: GlobalState["setFilters"];
}) => {
  const selectionRange = {
    startDate:
      filters && filters.range?.startDate
        ? new Date(filters.range.startDate)
        : new Date(),
    endDate:
      filters && filters.range?.endDate
        ? new Date(filters.range.endDate)
        : new Date(),
    key: "selected",
  };

  return (
    <div>
      <label>Date Range</label>
      <DateRangePicker
        hoverRange="month"
        ranges={[]}
        onClean={() => setFilters({ ...filters, range: undefined })}
        onChange={(range: any) => {
          setFilters({
            ...filters,
            range: { startDate: range[0], endDate: range[1] },
          });
        }}
      />
    </div>
  );
};
