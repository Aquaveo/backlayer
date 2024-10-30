import { useEffect, useState } from 'react';
import moduleLoader from '../lib/ModuleLoader';
import { useMapContext } from '../hooks/useMapContext';

const Layer = ({ config }) => {
  const [layer, setLayer] = useState(null);
  const { map } = useMapContext();

  useEffect(() => {
    let isMounted = true;
    let addedToMap = false;

    const loadLayer = async () => {
      try {
        const layerInstance = await moduleLoader(config);

        if (isMounted) {
          setLayer(layerInstance);
          if (map && layerInstance) {
            map.addLayer(layerInstance);
            addedToMap = true;
          }
        }
      } catch (error) {
        console.error('Error loading layer:', error);
      }
    };

    loadLayer();

    return () => {
      isMounted = false;
      if (addedToMap && map && layer) {
        map.removeLayer(layer);
      }
    };
  }, [config, map]);

  return null; // Layers are managed by OpenLayers; no need to render anything
};

export default Layer;