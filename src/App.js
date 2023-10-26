// App.js
import React, { useEffect, useState, useCallback, useRef } from 'react';
import './font/fangzhengxiangsu.TTF';
import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ImageDisplay from './display/ImageDisplay';
import WelcomePage from './pages/welcomePage/welcomePage';
import CommentPage from './pages/commentPage/commentPage';
import PageIcons from './pages/pageIcons/pageIcon';
import EditPage from './pages/editingPage/editingPage'
import { Provider } from 'react-redux';
import { useHistory, withRouter, useLocation } from 'react-router-dom';
// import store from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import ResetHandler from './ResetHandler'; 

const { Sider, Content } = Layout;
const fontStyle = "'fangzhengxiangsu', sans-serif";

function App() {
  const history = useHistory();
  const timeoutIdRef = useRef(); // 使用useRef来持久化timeoutId

  const startInactivityTimer = useCallback(() => {
    timeoutIdRef.current = setTimeout(() => { // 将timeoutId存储在current属性中
      history.push('/');
    }, 120000); // 2分钟 (2 * 60 * 1000毫秒)
  }, [history]);

  const resetInactivityTimer = useCallback(() => {
    clearTimeout(timeoutIdRef.current); // 使用current属性中的timeoutId
    startInactivityTimer();
  }, [startInactivityTimer]);

  useEffect(() => {
    startInactivityTimer();
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    // 添加其他需要监听的事件

    return () => {
      clearTimeout(timeoutIdRef.current); // 使用current属性中的timeoutId
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keydown', resetInactivityTimer);
      // 移除之前添加的事件监听
    };
  }, [resetInactivityTimer, startInactivityTimer]);

  return (
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <div>
       <Switch> 
            <Route exact path="/" component={WelcomePage} /> 
            <Route path="/edit" render={() => ( 
              <Layout style={{ width: 5120, height: 2880, backgroundColor: 'black', fontFamily: fontStyle }}> 
                <Sider width={1740} style={{ backgroundColor: 'black' }}> 
                  <Route exact path="/edit" component={EditPage} /> 
                  {/* <Route exact path="/comment" component={CommentPage} /> */} 
                  <PageIcons /> 
                </Sider> 
                <Content> 
                  <ImageDisplay />
                </Content>
              </Layout>
            )} /> 
            <Route path="/comment" render={() => ( 
              <Layout style={{ width: 5120, height: 2880, backgroundColor: 'black', fontFamily: fontStyle }}> 
                <Sider width={1740} style={{ backgroundColor: 'black' }}> 
                  {/* <Route exact path="/edit" component={EditPage} /> */} 
                  <Route exact path="/comment" component={CommentPage} /> 
                  <PageIcons />
                </Sider>
                <Content>
                  <ImageDisplay />
                </Content>
              </Layout>
            )} />
          </Switch>
      </div>
    
    {/* ResetHandler用来清除持久化数据，使用一次后注释掉 */}
    {/* <ResetHandler />  */}
    </PersistGate>
    </Provider>
  );
}

export default withRouter(App);
