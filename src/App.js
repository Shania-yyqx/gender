import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Layout } from 'antd';
// import 'antd/dist/antd.css';
import ImageDisplay from './display/ImageDisplay'
const { Sider, Content } = Layout;

function App() {
  return (
    <Layout style={{ width: 5120, height: 2880 }}>
      <Sider theme="light" width={1740}>
        {/* 用户交互界面组件放在这里 */}
      </Sider>
      <Content>
        <ImageDisplay/>
      </Content>
    </Layout>
  );
}

export default App;
