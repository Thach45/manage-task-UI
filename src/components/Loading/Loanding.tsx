import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import styled from 'styled-components';

const CenteredFlex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height */
`;

const Loading: React.FC = () => (
  <CenteredFlex>
    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
  </CenteredFlex>
);

export default Loading;