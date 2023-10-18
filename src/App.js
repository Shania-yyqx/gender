// App.js
import React, { useState } from 'react';
import './font/fangzhengxiangsu.TTF';
import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ImageDisplay from './display/ImageDisplay';
import WelcomePage from './pages/welcomePage/welcomePage';
import CommentPage from './pages/commentPage/commentPage';
import PageIcons from './pages/pageIcons/pageIcon';
import EditPage from './pages/editingPage/editingPage';

const { Sider, Content } = Layout;
const fontStyle = "'fangzhengxiangsu', sans-serif";

function App() {
  const [dataFromChild, setDataFromChild] = useState(null);

  const handleDataFromChild = (data) => {
    setDataFromChild(data);
  }

  return (
    <Router>
      <Layout style={{ width: 5120, height: 2880, backgroundColor: 'black', fontFamily: fontStyle }}>
        <Sider width={1740} style={{ backgroundColor: 'black' }}>
          <Switch>
            <Route exact path="/welcome" component={WelcomePage} />
            <Route exact path="/comment" component={CommentPage} />
            <Route exact path="/" render={() => <EditPage sendDataToParent={handleDataFromChild} />} />
          </Switch>
          <PageIcons />
        </Sider>
        <Content>
          <ImageDisplay modifiedNum={dataFromChild} /> {/* 传递 dataFromChild 到 ImageDisplay */}
        </Content> 
      </Layout> 
    </Router> 
  );
}

export default App;
