[//]: <> (start placeholder for auto-badger)

[![version](https://img.shields.io/npm/v/backlayer.svg?style=flat-square)](https://npmjs.org/backlayer)
[![min size](https://img.shields.io/bundlephobia/min/backlayer?style=flat-square)](https://bundlephobia.com/result?p=backlayer)
[![mingzip size](https://img.shields.io/bundlephobia/minzip/backlayer)](https://bundlephobia.com/result?p=backlayer)
[![license](https://img.shields.io/npm/l/backlayer?color=%23007a1f&style=flat-square)](https://github.com/Aquaveo/backlayer/blob/master/LICENSE)

[![stargazers](https://img.shields.io/github/stars/Aquaveo/backlayer?style=social)](https://github.com/Aquaveo/backlayer/stargazers)
[![number of forks](https://img.shields.io/github/forks/Aquaveo/backlayer?style=social)](https://github.com/Aquaveo/backlayer/fork)

###### :heart: to [auto badger](https://github.com/technikhil314/auto-badger) for making badging simple

# Backlayer

The BackLayer (Open Layer Components Backend Driven) is a POC package that allows to build npm components dynamically, based on dictionaries taht are send through a backend engine. This package is used to help with the creation of Tethys plugins, so the backend part of the plugin (usually an intake driver) can reference a react UI component(which will use the `backlayer` package if any Open Layers capability is needed)

## Prerequisites

This project requires NodeJS (version 8 or later) and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.
You can install the Node Version Manager and Node.js:

a. [Install Node Version Manager (nvm)](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script)
b. CLOSE ALL OF YOUR TERMINALS AND OPEN NEW ONES
c. Use NVM to install Node.js 20

```sh
$ nvm install 20
$ nvm use 20
$ npm -v && node -v
```

## Table of contents

- [BackLayer](#backlayer)
  - [Prerequisites](#prerequisites)
  - [Table of contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Components](#components)
    - [Map](#map)
    - [View](#view)
    - [Layer](#layer)
    - [LegendControl](#legendcontrol)
    - [LayersControl](#layerscontrol)
    - [OverLay](#overlay)
  - [Authors](#authors)
  - [License](#license)

## Getting Started

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

Start with cloning this repo on your local machine:

```sh
$ git clone https://github.com/Aquaveo/backlayer.git
$ cd backlayer
```

To install and set up the library, run:

```sh
$ npm install -S backlayer
```

Or if you prefer using Yarn:

```sh
$ yarn add --dev backlayer
```

### Building a distribution version

```sh
$ npm run build
```

This task will create a distribution version of the project inside your local `dist/` folder. The package uses `Webpack` to bundle the package

## Components.

The `backlayer` package contains the following components:

- `Map` -> Component that represents `ol/Map` that wraps the other different other components
- `View` -> Component representing `ol/view` that takes a dictionary with the args that `ol/view` takes.
- `Layer` -> Component that consumes from an object to make any type of layer available in `ol`
- `Layers` -> Wrapper for the different `Layer` components
- `Controls` -> Wrapper for the different `Control` components
- `LegendControl` -> Component that creates a Legend given an object
- `LayersControl` -> Component that creates a layer switch component.
- `Overlays` -> Wrapper for the different `Overlay` components
- `OverLay` -> Component for `ol/overlay`that takes an object with the args required by `ol/overlay`

Example:

```js
import React, { memo } from 'react';

import {
  Map,
  View,
  Layer,
  Layers,
  Controls,
  LegendControl,
  LayersControl,
  Overlays,
  OverLay,
} from 'backlayer';

import {
  DemoLayers,
  DemoViewConfig,
  DemoMapConfig,
  DemoLegend,
  DemoOverlays,
} from 'backlayer/demo';

const MapComponent = ({
  mapConfig = DemoMapConfig,
  viewConfig = DemoViewConfig,
  layers = DemoLayers,
  legend = DemoLegend,
  overlays = DemoOverlays,
}) => {
  return (
    <Map {...mapConfig}>
      <View {...viewConfig} />
      <Layers>
        {layers &&
          layers.map((config, index) => <Layer key={index} config={config} />)}
      </Layers>
      <Controls>
        <LayersControl />
        <LegendControl items={legend} />
      </Controls>
      <Overlays>
        {overlays &&
          overlays.map((config, index) => (
            <OverLay key={index} {...config.props}></OverLay>
          ))}
      </Overlays>
    </Map>
  );
};

export default memo(MapComponent);
```

### Map

Example:

```js
import { Map } from 'backlayer';

const demoMapConfig = {
  className: 'ol-map',
  style: {
    width: '100%',
    height: '100vh',
  },
};
<Map {...demoMapConfig}>......</Map>;
```

Please note that both the `classname` and `style` needs to be provided.

### View

Example:

```js
import { View } from 'backlayer';

const demoViewConfig = {
  center: fromLonLat([-110.875, 37.345]),
  zoom: 5,
};

<View {...demoViewConfig} />;
```

Please note that `demoViewConfig` can contain any option listed [here](https://openlayers.org/en/latest/apidoc/module-ol_View-View.html)

### Layer

Example:

```js
import { Layers, Layer } from 'backlayer';

const DemoLayers = [
  {
    type: 'WebGLTile',
    props: {
      source: {
        type: 'ImageTile',
        props: {
          url: 'https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          attributions:
            'Tiles © <a href="https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer">ArcGIS</a>',
        },
      },
      name: 'World Dark Gray Base Base Map',
      zIndex: 0,
    },
  },
  {
    type: 'ImageLayer',
    props: {
      source: {
        type: 'ImageArcGISRest',
        props: {
          url: 'https://mapservices.weather.noaa.gov/eventdriven/rest/services/water/riv_gauges/MapServer',
          params: {
            LAYERS: 'show:0',
            layerDefs: JSON.stringify({
              0: "status = 'action' or status='minor' or status='moderate' or status='major'",
            }),
          },
        },
      },
      name: 'Flooding River Gauges',
      zIndex: 1,
    },
  },
  {
    type: 'VectorLayer',
    props: {
      source: {
        type: 'Vector',
        props: {
          url: 'https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0/query?where=1%3D1&outFields=*&returnGeometry=true&f=geojson',
          format: {
            type: 'GeoJSON',
            props: {},
          },
        },
      },
      style: {
        type: 'Style',
        props: {
          stroke: {
            type: 'Stroke',
            props: {
              color: '#501020',
              width: 1,
            },
          },
        },
      },
      name: 'rfc max forecast (Decreasing Forecast Trend)',
      zIndex: 2,
    },
  },
];

<Layers>
  {layers &&
    layers.map((config, index) => <Layer key={index} config={config} />)}
</Layers>;
```

Please note that the object used to generate the different layers. follows the same structure:

- `type`: the association to the `ol` type. This can be found [here](https://github.com/Aquaveo/backlayer/blob/main/src/lib/ModuleLoader.js#L75):

```js
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
```

- `props`: the different options that the `ol` type (e.g. `ol/layer/Image`, `ol/layer/Vector`) will need:
  Please note that the props can have a nested structure, and do not limit to only, layers, but they can be sources, styles, etc

Please look at the [example](#layer)

### LegendControl

Example:

```js
import { Controls, LegendControl } from 'backlayer';

const demoLegend = [
  {
    label: 'Major Flood',
    color: '#cc33ff',
  },
  {
    label: 'Moderate Flood',
    color: '#ff0000',
  },
  {
    label: 'Minor Flood',
    color: '#ff9900',
  },
  {
    label: 'Action',
    color: '#ffff00',
  },
  {
    label: 'No Flood',
    color: '#00ff00',
  },
  {
    label: 'Flood Category Not Defined',
    color: '#72afe9',
  },
  {
    label: 'Low Water Threshold',
    color: '#906320',
  },
  {
    label: 'Data Not Current',
    color: '#bdc2bb',
  },
  {
    label: 'Out of Service',
    color: '#666666',
  },
];

<Controls>
  <LegendControl items={demoLegend} />
</Controls>;
```

Please note the structure of the props object for `items`

### LayersControl

Example:

```js
import { Controls, LayersControl } from 'backlayer';

<Controls>
  <LegendControl items={legend} />
</Controls>;
```

### OverLay

Example:

```js
import { Overlays, OverLay } from 'backlayer';

const demoOverlays = [
  {
    div_id: "overlay-1",
    div_class: "modal-overlay",
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  }
]

<Overlays>
  {demoOverlays &&
    demoOverlays.map((config, index) => (
      <OverLay key={index} {...config.props}></OverLay>
    ))}
</Overlays>;
```

Please note that the props object contains two attributes `div_id` and `div_class` that are used for the `id` and `class` of the `div` container of the overlay

### Sample Data

You can use the following for demo data.

```js
import {
  DemoLayers,
  DemoViewConfig,
  DemoMapConfig,
  DemoLegend,
  DemoOverlays,
} from 'backlayer/demo';
```

## Authors

- **Aquaveo LLC**

## License

MIT License
