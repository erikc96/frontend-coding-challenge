// Map component
import mapboxgl from "mapbox-gl";
import React, { useMemo, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { useGlobalStateContext } from "../hooks";
import { Earthquake } from "../types";
import { EarthquakeDetails } from "./EarthquakeDetails";

export const drawPopup = (map: any, earthquake: Earthquake) => {
  console.log("drawPopup", earthquake);

  map.fire('closeAllPopups');
  const popup = new mapboxgl.Popup({ offset: 25 })
  popup.setLngLat(earthquake.geometry.coordinates as any)
  const text = ReactDOMServer.renderToString(<EarthquakeDetails earthquake={earthquake || null} />)
  popup.setHTML(text)
  popup.addTo(map);
  // wait 1 second
  map.on('closeAllPopups', () => {
    popup.remove();
  });
}

// Uses mapbox-gl to render a map
export const Map = () => {
  const mapContainer = useRef<any>(null);
  const { earthquakes, selected, setSelected, earthquakeCollection, earthquakesById, mapState, setMapState, filteredEarthquakes } = useGlobalStateContext();
  const { latitude, longitude, zoom } = mapState;

  React.useEffect(() => {
    setMapState({ ...mapState, ref: mapContainer.current });
  }, [mapContainer.current])

  const center = [longitude, latitude] as [number, number];
  const [count, setCount] = useState(0);
  const loaded = useRef(false);
  const map = mapContainer.current

  React.useEffect(() => {
    if (count !== 0) {
      mapContainer.current.flyTo({
        center,
        zoom,
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
      });
    }
    setCount(count + 1)
  }, [latitude, longitude, zoom]);

  const mapData = useMemo(() => {
    return {
      ...earthquakeCollection,
      features:
        filteredEarthquakes.map((earthquake: Earthquake) => {
          const [longitude, latitude] = earthquake.geometry.coordinates;
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            properties: {
              title: earthquake.properties.title,
              id: earthquake.id,
              description: earthquake.properties.place,
              'marker-color': '#3FB1CE',
              'marker-size': 'large',
              'marker-symbol': 'circle'
            }
          }
        })
    }
  }, [filteredEarthquakes]);


  React.useEffect(() => {
    try {
      if (mapContainer.current) {
        if (!loaded.current) {
          mapContainer.current.on('load', () => {
            mapContainer.current.getSource('earthquakes').setData(mapData);
          });
        }
        mapContainer.current.getSource('earthquakes').setData(mapData);
      }
    } catch (e) {
      console.log(e)
    }
  }, [mapData])

  const popupOpen = useRef(false);

  const earthquakesRef = useRef(earthquakes)
  React.useEffect(() => {
    earthquakesRef.current = earthquakes
  }, [earthquakes])



  React.useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY3JhaWdvZWoiLCJhIjoiY2xic2F0cnZpMDE1aTNxcGZqZTRubzl2cCJ9.vd4qf2OUBfarhC31e_11jw'; // TODO
    mapContainer.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center,
      zoom
    });
    mapContainer.current.on('load', () => {
      loaded.current = true;
      mapContainer.current.addSource('earthquakes', {
        type: 'geojson',
        data: earthquakeCollection
      });
      mapContainer.current.addLayer({
        'id': 'earthquakes-layer',
        'interactive': true,
        'type': 'circle',
        'source': 'earthquakes',
        'paint': {
          'circle-radius': 4,
          'circle-stroke-width': 2,
          'circle-color': 'red',
          'circle-stroke-color': 'white'
        }
      });

      mapContainer.current.on('click', (e: any) => {
        const features = mapContainer.current.queryRenderedFeatures(e.point, { layers: ['earthquakes-layer'] });

        if (!features.length) {
          return;
        }

        const feature = features[0];

        popupOpen.current = true
        //Use Feature and put your code
        // Populate the popup and set its coordinates
        // based on the feature found.
        const earthquake = earthquakesRef.current.find((earthquake: Earthquake) => (earthquake.id === feature.properties.id))
        if (earthquake) {
          drawPopup(mapContainer.current, earthquake)
          setSelected({ ...selected, earthquakeId: earthquake?.id || null })
        }
      });

    })

  }, [])


  // render component
  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
