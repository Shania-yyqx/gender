import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Layout } from 'antd';
// import 'antd/dist/antd.css';
import ImageDisplay from './display/ImageDisplay'
import WelcomePage from './pages/welcomePage/welcomePage'
const { Sider, Content } = Layout;

function App() {
  return (
    <Layout style={{ width: 5120, height: 2880, backgroundColor:'black' }}>
      <Sider  width={1740} style={{  backgroundColor:'black' }}>
        {/* 用户交互界面组件放在这里 */}
        <WelcomePage/>
      </Sider>
      <Content>
        <ImageDisplay/>
      </Content>
    </Layout>
  );
}

export default App;
