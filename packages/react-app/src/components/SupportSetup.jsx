import { Button, Space } from 'antd';
import React, { useState } from 'react';

export default function SupportSetup(props) {
    console.log('props: ', props);
    const [loadings, setLoadings] = useState([]);

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('chat', props.chatSupport);
        window.location.search = urlParams;
        console.log('urlParams: ', urlParams);
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 6000);
  };

  return (
    <>
      <Space
        style={{
          width: '100%',
        }}
      >
        <Button type="primary" loading={loadings[0]} onClick={() => enterLoading(0)}>
          Click to configure
        </Button>
      </Space>
    </>
  );
};

