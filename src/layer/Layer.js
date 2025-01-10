import { useEffect, useState } from "react";
import moduleLoader from "../lib/ModuleLoader";
import { useMapContext } from "../hooks/useMapContext";

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
        console.error("Error loading layer:", error);
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

  return null;
};

export function getFeatureQueryUrl(layerConfiguration) {
  const layerUrl = layerConfiguration.props.source.props.url;
  if (layerUrl.includes("MapServer")) {
    return layerUrl + "/identify";
  } else {
    throw Error(`${url} is not currently configured to be queried`);
  }
}

export async function getLayerAttributes(url, layerType) {
  let attributes;
  if (url.includes("MapServer")) {
    attributes = await getESRILayerAttributes(url);
  } else {
    throw Error(`${url} is not currently configured to be queried`);
  }

  return attributes;
}

export async function queryLayerFeatures(layerInfo, map, coordinate) {
  let features;
  const layerUrl = layerInfo.configuration.props.source.props.url;
  if (layerUrl.includes("MapServer")) {
    features = await getESRILayerFeatures(layerUrl, map, coordinate);
  } else {
    throw Error(`${layerUrl} is not currently configured to be queried`);
  }

  return features;
}

async function getESRILayerFeatures(layerUrl, map, coordinate) {
  const featureQueryUrl = layerUrl + "/identify";
  // Build the identify request parameters
  const params = new URLSearchParams({
    f: "json",
    tolerance: 50, // Pixel tolerance
    returnGeometry: true,
    geometryType: "esriGeometryPoint",
    sr: 3857,
    geometry: coordinate.join(","),
    mapExtent: map.getView().calculateExtent().join(","),
    imageDisplay: "800,600,96",
  });

  try {
    const featureQuery = await fetch(`${featureQueryUrl}?${params.toString()}`);
    const featureQueryJson = await featureQuery.json();
    if (featureQueryJson.results && featureQueryJson.results.length > 0) {
      return featureQueryJson.results;
    } else {
      alert(
        "River not found. Try to zoom in and be precise when clicking the map."
      );
    }
  } catch {
    (error) => {
      console.error("Identify request failed:", error);
      return null;
    };
  }
}

async function getESRILayerAttributes(url) {
  const layerInfoParams = new URLSearchParams({
    f: "json",
  });

  const layerInfoUrl = `${url}?${layerInfoParams.toString()}`;
  const layerInfoResponse = await fetch(layerInfoUrl);
  const layerInfoJson = await layerInfoResponse.json();

  const layerAttributes = {};
  const layers = layerInfoJson.layers.map((layer) => layer.name);

  for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
    let layerName = layers[layerIndex];
    let specificLayerInfoUrl = `${url}/${layerIndex}?${layerInfoParams.toString()}`;
    let specificLayerInfoResponse = await fetch(specificLayerInfoUrl);
    let specificLayerInfoJson = await specificLayerInfoResponse.json();
    let specificLayerFieds = [];
    for (const field of specificLayerInfoJson.fields) {
      if (["objectid", "shape", "geom", "oid"].includes(field.name)) {
        continue;
      }
      specificLayerFieds.push({ name: field.name, alias: field.alias });
    }
    layerAttributes[layerName] = specificLayerFieds;
  }

  return layerAttributes;
}

export default Layer;
