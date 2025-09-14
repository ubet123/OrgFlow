import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import styled from 'styled-components';

const SunContainer = styled.div`
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 2px;
  
  /* Smooth scaling on hover */
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.1);
  }
`;

const SunAnimation = () => {
  return (
    <SunContainer>
      <DotLottieReact
        src="https://lottie.host/7ece1984-2a18-430f-b797-71ab1aee6c01/F9mtldXetC.lottie"
        loop
        autoplay
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: 'none' 
        }}
      />
    </SunContainer>
  );
};

export default SunAnimation;