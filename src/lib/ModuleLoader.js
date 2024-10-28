import { moduleMap } from './moduleMap.js';

const moduleCache = {};

const moduleLoader = async (config) => {
  const { type, props } = config;

  if (!type) {
    return props;
  }

  if (moduleCache[type]) {
    return new moduleCache[type](await resolveProps(props));
  }

  try {
    const importModule = getModuleImporter(type);
    const module = await importModule();

    const ModuleConstructor = module.default;

    if (typeof ModuleConstructor !== 'function') {
      throw new Error(`Module '${type}' does not export a constructor.`);
    }

    moduleCache[type] = ModuleConstructor;

    const resolvedProps = await resolveProps(props);
    
    return new ModuleConstructor(resolvedProps);
  } catch (error) {
    console.error(`Failed to load module '${type}':`, error);
    throw error;
  }
};

// Helper function to resolve nested props
const resolveProps = async (props) => {
  if (!props) return {};

  const resolvedProps = {};

  for (const key of Object.keys(props)) {
    const value = props[key];

    if (value && typeof value === 'object') {
      if ('type' in value && 'props' in value) {
        // It's a module configuration; process with moduleLoader
        resolvedProps[key] = await moduleLoader(value);
      } else if (Array.isArray(value)) {
        // It's an array; resolve each item
        resolvedProps[key] = await Promise.all(
          value.map(async (item) => {
            if (item && typeof item === 'object') {
              return await resolveProps(item);
            } else {
              return item;
            }
          })
        );
      } else {
        // It's a regular object; recursively resolve its properties
        resolvedProps[key] = await resolveProps(value);
      }
    } else {
      // It's a primitive value; assign as is
      resolvedProps[key] = value;
    }
  }

  return resolvedProps;
};

// Helper function to map type strings to module paths
const getModuleImporter = (type) => {
    const typeMapping = {
      // Map type strings to module paths
      WebGLTile: 'ol/layer/WebGLTile.js',
      ImageLayer: 'ol/layer/Image.js',
      VectorLayer: 'ol/layer/Vector.js',
      ImageTile: 'ol/source/ImageTile.js',
      ImageArcGISRest: 'ol/source/ImageArcGISRest.js',
      Vector: 'ol/source/Vector.js',
      GeoJSON: 'ol/format/GeoJSON.js',
      Style: 'ol/style/Style.js',
      Stroke: 'ol/style/Stroke.js',
      Fill: 'ol/style/Fill.js',
      // Add other mappings as needed
    };
  
    const modulePath = typeMapping[type];
  
    if (!modulePath) {
      throw new Error(`No module path found for type '${type}'.`);
    }
  
    const importer = moduleMap[modulePath];
  
    if (!importer) {
      throw new Error(`No importer found for module path '${modulePath}'.`);
    }
  
    return importer;
  };

export default moduleLoader;
