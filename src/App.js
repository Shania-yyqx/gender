import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // 导入 React Router 相关组件
import ImageDisplay from './display/ImageDisplay';
import WelcomePage from './pages/welcomePage/welcomePage';
import CommentPage from './pages/commentPage/commentPage';
import PageIcons from './pages/pageIcons/pageIcon';
import EditPage from './pages/editingPage/editingPage'

const { Sider, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ width: 5120, height: 2880, backgroundColor: 'black' }}>
        <Sider width={1740} style={{ backgroundColor: 'black' }}>
          <Switch>
            <Route exact path="/" component={WelcomePage} />
            <Route exact path="/comment" component={CommentPage} />
            <Route exact path="/edit" component={EditPage} />
          </Switch>
          <PageIcons />
        </Sider>
        <Content>
          <ImageDisplay />
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
