import React from "react";
import { useGlobalStateContext, usePagination } from "../hooks";
import { Earthquake } from "../types";
import { drawPopup } from "./Map";

const MAGIC_NUMBER = 22;
export const EarthquakeList = () => {
  const {
    initialized,
    filteredEarthquakes,
    mapState,
    setMapState,
    selected,
    setSelected,
  } = useGlobalStateContext();

  const handleResizeForLargeText = (text: string) => {
    if (text.length > MAGIC_NUMBER) {
      return text.slice(0, MAGIC_NUMBER) + "...";
    }
    return text;
  };

  const handleEarthquakeClick = React.useCallback(
    (earthquake: Earthquake) => {
      // zoom map to location of earthquake
      const { coordinates } = earthquake.geometry;
      const [longitude, latitude] = coordinates;
      if (earthquake.id) {
        setSelected({
          ...selected,
          earthquakeId: earthquake.id,
        });
      }
      drawPopup(mapState.ref, earthquake);

      // setMapState({ ...mapState, longitude, latitude, zoom: 9 })
    },
    [setSelected, mapState.ref]
  );

  const [paginatedData, getPaginationProps] = usePagination(
    filteredEarthquakes,
    25
  );
  const { currentPage, maxPage, goToNextPage, goToPreviousPage, setPage } =
    getPaginationProps();

  React.useEffect(() => {
    if (selected.earthquakeId) {
      const index = filteredEarthquakes.findIndex(
        (earthquake: Earthquake) => earthquake.id === selected.earthquakeId
      );
      setPage(Math.ceil((index + 1) / 25));
    }
  }, [selected]);

  if (!initialized) return <div>Loading...</div>;
  // List of earthquakes; earthquakes are color coded by severity
  return (
    <div className="Earthquake-List">
      <ul>
        {paginatedData.map((earthquake: Earthquake) => {
          return (
            <li
              className={
                earthquake.id === selected.earthquakeId
                  ? "Earthquake-Selected"
                  : ""
              }
              onClick={() => handleEarthquakeClick(earthquake)}
            >
              M
              <span
                className={
                  "Earthquake-Magnitude Earthquake-Magnitude-" +
                  Math.floor(earthquake.properties.mag)
                }
              >
                {Math.round(earthquake.properties.mag * 100) / 100}
              </span>{" "}
              -{" "}
              <span>
                {handleResizeForLargeText(earthquake.properties.place)}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="Pagination">
        <div>
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="previous round"
          >
            &#8249;
          </button>
          Page {currentPage} of {maxPage}
          <button
            onClick={goToNextPage}
            disabled={currentPage === maxPage}
            className="next round"
          >
            &#8250;
          </button>
        </div>

        <div>
          Showing {paginatedData.length} of {filteredEarthquakes.length}{" "}
          earthquakes
        </div>
      </div>
    </div>
  );
};
