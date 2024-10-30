import Overlay from 'ol/Overlay.js';
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useMapContext } from '../hooks/useMapContext';
import styled from 'styled-components';


const OverLayContentWrapper = styled.div`
  position: absolute;
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #ccc;
  min-width: 200px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  transform: translate(-50%, -100%);

  &:after,
  &:before {
    bottom: -20px;
    border: solid transparent;
    content: '';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }

  &:after {
    border-top-color: white;
    border-width: 10px;
    left: 50%;
    margin-left: -10px;
  }

  &:before {
    border-top-color: #ccc;
    border-width: 11px;
    left: 50%;
    margin-left: -11px;
  }
`;


const OverLay = (props) => {
  const { map } = useMapContext();  // Custom map context
  const overlayRef = useRef(null);  // Ref to the DOM element
  // if you need to access the overlay instance within this component then create a ref to it
  // const olOverlayRef = useRef(null); // Ref to the OpenLayers Overlay instance
  // olOverlayRef.current
  useEffect(() => {
    if (!map || !overlayRef.current) return;

    const overlay = new Overlay({
      element: overlayRef.current,
      ...props
    });

    map.addOverlay(overlay);

    // Cleanup function to remove the overlay from the map on unmount
    return () => {
      if (!map) return;
      map.removeOverlay(overlay);
    };
  }, [map]);

  return(
    <OverLayContentWrapper>
      <div id={props.div_id} className={props.div_class} ref={overlayRef}>
        {props.children}
      </div>
    </OverLayContentWrapper>
  );
};

export default OverLay;