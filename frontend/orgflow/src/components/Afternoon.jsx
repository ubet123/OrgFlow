import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import styled from 'styled-components';

const AfternoonContainer = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 8px;
  
  /* Smooth scaling on hover */
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.1);
  }
`;

const Afternoon = () => {
  return (
    <AfternoonContainer>
      <DotLottieReact
        src="https://lottie.host/7e7b094e-fca9-40d3-aa18-070eaf73ec31/diLD2UQmP2.lottie"
        loop
        autoplay
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />
    </AfternoonContainer>
  );
};

export default Afternoon;