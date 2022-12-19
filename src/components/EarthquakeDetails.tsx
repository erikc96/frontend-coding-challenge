import React from 'react'
import { Earthquake } from '../types';
// props and return type for EarthquakeDetails
type EarthquakeDetailsProps = {
  earthquake: Earthquake | null;
}
type EarhquakeDetailsType = (props: EarthquakeDetailsProps) => JSX.Element;
export const EarthquakeDetails: EarhquakeDetailsType = ({ earthquake }) => {
  // if not selected, return dashed line
  if (!earthquake) return <div className="Earthquake-Details">---</div>

  // Clicking on an earthquake data point on the map should surface the 
  // magnitude,
  // title,
  // and timestamp
  // of the earthquake in a legend and popup marker on the map.
  const { mag: magnitude, title, time } = earthquake.properties;
  return (
    <div className="Earthquake-Details">
      <div>Magnitude: {magnitude}</div>
      <div>Title: {title}</div>
      <div>Timestamp: {new Date(time).toString()}</div>
    </div>
  )
}
