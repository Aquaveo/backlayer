import React, { useEffect , useState, useRef } from 'react';
import MapContext from './contexts/MapContext';
import OLMap from 'ol/Map.js';
import View from 'ol/View.js';

const Map = ({ children, ...props}) => {

  const mapRef = useRef();
  const [map, setMap] = useState(null);

  useEffect(() => {
    console.log(props)
    let options = {
      view: new View({
        center: [0, 0],
        zoom: 1,
      }),
      layers: [],
      controls: [],
      overlays: []
    };
    
    let mapObject = new OLMap(options);
    mapObject.setTarget(mapRef.current);
    setMap(mapObject);

    return () => mapObject.setTarget(undefined);

  }, []);

  return (
    <MapContext.Provider value={{ map }}>
        <div 
          ref={mapRef} 
          className= {props.className}
          style={props.style}
        >
          {children}
        </div>
    </MapContext.Provider>

  );
}

export {Map};