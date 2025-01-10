import React, { useEffect, useState, useRef } from "react";
import MapContext from "./contexts/MapContext";
import { Map as OlMap, View } from "ol";
import moduleLoader from "./lib/ModuleLoader";
import Controls from "./control/Controls";
import LayersControl from "./control/LayersControl";
import LegendControl from "./control/Legend";
import Alert from "react-bootstrap/Alert";

const Map = ({
  mapConfig,
  viewConfig,
  layers,
  legend,
  layerControl,
  onMapClick,
  children,
}) => {
  const [map, setMap] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const mapRef = useRef();
  const onMapClickCurrent = useRef();

  const defaultMapConfig = {
    className: "ol-map",
    style: { width: "100%", height: "100%", position: "relative" },
  };
  const customMapConfig = { ...defaultMapConfig, ...mapConfig };

  const defaultViewConfig = {
    projection: "EPSG:3857",
    zoom: 4.5,
    center: [-10686671.116154263, 4721671.572580108],
  };
  const customViewConfig = { ...defaultViewConfig, ...viewConfig };

  useEffect(() => {
    const initialMap = new OlMap({
      target: mapRef.current,
      view: new View({
        ...customViewConfig,
      }),
      layers: [],
      controls: [],
      overlays: [],
    });

    setMap(initialMap);

    return () => {
      initialMap.setTarget(undefined);
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    const defaultBaseLayers = [
      {
        type: "WebGLTile",
        props: {
          source: {
            type: "ImageTile",
            props: {
              url: "https://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
              attributions:
                'Tiles © <a href="https://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
            },
          },
          name: "World Street Map",
        },
      },
    ];
    const customBaseLayers = layers ? layers : defaultBaseLayers;
    const mapLayers = [...map.getLayers().getArray()];
    mapLayers.forEach((mapLayer) => map.removeLayer(mapLayer));

    customBaseLayers.forEach((layerConfig) => {
      moduleLoader(layerConfig)
        .then((layerInstance) => {
          map.addLayer(layerInstance);
        })
        .catch((err) => {
          console.log(err);
          setErrorMessage(
            `Failed to load the '${layerConfig.props.name}' layer`
          );
        });
    });

    if (onMapClickCurrent.current) {
      map.un("singleclick", onMapClickCurrent.current);
    }
    onMapClickCurrent.current = function (evt) {
      onMapClick(map, evt);
    };
    map.on("singleclick", onMapClickCurrent.current);

    map.renderSync();
  }, [map, layers]);

  return (
    <>
      <MapContext.Provider value={{ map }}>
        <div ref={mapRef} {...customMapConfig}>
          {errorMessage && (
            <Alert
              key="failure"
              variant="danger"
              dismissible={true}
              onClose={() => setErrorMessage("")}
            >
              {errorMessage}
            </Alert>
          )}
          <Controls>
            {layerControl && <LayersControl items={layerControl} />}
            {legend && <LegendControl items={legend} />}
          </Controls>
          {children}
        </div>
      </MapContext.Provider>
    </>
  );
};

export { Map };
