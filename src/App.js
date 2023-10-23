// App.js
import React, { useEffect, useState } from 'react';
import './font/fangzhengxiangsu.TTF';
import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ImageDisplay from './display/ImageDisplay';
import WelcomePage from './pages/welcomePage/welcomePage';
import CommentPage from './pages/commentPage/commentPage';
import PageIcons from './pages/pageIcons/pageIcon';
import EditPage from './pages/editingPage/editingPage'
import { Provider } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
// import store from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import ResetHandler from './ResetHandler'; 

const { Sider, Content } = Layout;
const fontStyle = "'fangzhengxiangsu', sans-serif";

function App() {
  const [dataFromChild, setDataFromChild] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const history = useHistory();

  console.log(history)
  

  const handleDataFromChild = (data) => {
    setDataFromChild(data);
  }

  const isShowWelcome = ()=> {
    console.log(history)
    setShowWelcome(false);
    // history.push('/edit');
  }

  useEffect(() => {
    if (!showWelcome) {
      history.push('/edit');
    }
  }, [showWelcome, history]);

  return (
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    
      <div>
      <Switch>
      {showWelcome ? (
        <div style={{ width: 5120, height: 2880, backgroundColor: 'black', fontFamily: fontStyle }} onClick={isShowWelcome}>
            <Route exact path="/" component={WelcomePage} />
        </div>
      ):
      (
      <Layout style={{ width: 5120, height: 2880, backgroundColor: 'black', fontFamily: fontStyle }}>
        <Sider width={1740} style={{ backgroundColor: 'black' }}>
            <Route exact path="/edit" component={EditPage} />
            <Route exact path="/comment" component={CommentPage} />
          <PageIcons />
        </Sider>
        <Content>
          <ImageDisplay />
        </Content>
      </Layout>
      )}
      </Switch>
      </div>
    
    {/* ResetHandler用来清除持久化数据，使用一次后注释掉 */}
    {/* <ResetHandler />  */}
    </PersistGate>
    </Provider>
  );
}

export default withRouter(App);
