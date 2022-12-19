import React from "react";
import { Earthquake } from "../types";
// props and return type for EarthquakeDetails
type EarthquakeDetailsProps = {
  earthquake: Earthquake | null;
};
type EarhquakeDetailsType = (props: EarthquakeDetailsProps) => JSX.Element;
export const EarthquakeDetails: EarhquakeDetailsType = ({ earthquake }) => {
  // if not selected, return dashed line
  if (!earthquake) return <div className="Earthquake-Details">---</div>;

  // Clicking on an earthquake data point on the map should surface the
  // magnitude,
  // title,
  // and timestamp
  // of the earthquake in a legend and popup marker on the map.
  const { mag: magnitude, title, time } = earthquake.properties;
  const formattedTimestamp = new Date(time).toLocaleString("en-US", {
    timeZone: "UTC",
  });
  return (
    <div className="Earthquake-Details">
      <div>
        <span style={{ fontWeight: 600 }}>Title:</span> {title}
      </div>
      <div>
        <span style={{ fontWeight: 600 }}>Magnitude:</span>{" "}
        <span
          className={
            "Earthquake-Magnitude-" + Math.floor(earthquake.properties.mag)
          }
        >
          {magnitude}
        </span>
      </div>
      <div>
        <span style={{ fontWeight: 600 }}>Date/Time:</span> {formattedTimestamp}
      </div>
    </div>
  );
};
