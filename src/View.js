import { useEffect} from 'react';

import { useMapContext } from './hooks/useMapContext';

import OLView from 'ol/View.js';

const View = ({ ...props}) => {
  const {map} = useMapContext();

  useEffect(() => {
    if (!map) return;
    map.setView(
        new OLView({
            ...props
        })
    )

    return () => {
        if (!map) return;
        map.setView(null)
    };

  }, [props]);

  return null
};

export {View};