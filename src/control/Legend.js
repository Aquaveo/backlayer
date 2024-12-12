import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTimes, FaListUl } from 'react-icons/fa'; // Import icons

const LegendWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
`;

const LegendControlContainer = styled.div`
  background-color: white;
  padding: ${(props) => (props.$isexpanded ? '10px' : '5px')};
  z-index: 1000;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: ${(props) => (props.$isexpanded ? '200px' : '40px')};
  height: ${(props) => (props.$isexpanded ? '200px' : '40px')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;     /* Firefox */
  ::-webkit-scrollbar {
    display: none;
  }
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  position: absolute;
  top: 5px;
  right: 5px;
`;

const LegendControl = ({ items }) => {
  const [isexpanded, setisexpanded] = useState(false);

  return (
    <LegendWrapper>
      <LegendControlContainer $isexpanded={isexpanded}>
        {isexpanded ? (
          <>
            <CloseButton onClick={() => setisexpanded(false)}>
              <FaTimes />
            </CloseButton>
            <div
              style={{
                marginTop: '20px',
                width: '100%',
                height: '200px',
                overflowY: 'scroll',
              }}
            >
              {items.map((legendGroup, groupIndex) => (
                <div key={groupIndex} style={{ marginBottom: '10px' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    {legendGroup.title}
                  </p>
                  {legendGroup.items.map((subItem, subIndex) => (
                    <div
                      key={subIndex}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '5px',
                      }}
                    >
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          backgroundColor: subItem.color,
                          marginRight: '10px',
                        }}
                      ></div>
                      <div>{subItem.label}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        ) : (
          // Collapsed control - show the layers icon button
          <ControlButton onClick={() => setisexpanded(true)}>
            <FaListUl />
          </ControlButton>
        )}
      </LegendControlContainer>
    </LegendWrapper>
  );
};

export default LegendControl;
