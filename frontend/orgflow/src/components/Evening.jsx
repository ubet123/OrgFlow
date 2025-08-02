import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import styled from 'styled-components';

const EveningContainer = styled.div`
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

const Evening = () => {
  return (
    <EveningContainer>
      <DotLottieReact
        src="https://lottie.host/f23d7c88-6754-4bf6-84e4-b469bd7d67b7/lNUNzEEruO.lottie"
      
        loop
        autoplay
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />
    </EveningContainer>
  );
};

export default Evening;