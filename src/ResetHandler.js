// ResetHandler.js
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { persistor } from './redux/store';
import { resetState } from './redux/actions';  

const ResetHandler = () => {
  const dispatch = useDispatch();  

  // 用于初始化，初始化后需要注释掉（清空持久化的数据）
  useEffect(() => {
    const handleReset = () => {
      dispatch(resetState());
      persistor.purge();
    };
    
    handleReset();  // 在组件挂载时调用 handleReset 函数
    // 在使用后，注释掉此 useEffect
  }, [dispatch]);

  return null;  // 不渲染任何内容
};

export default ResetHandler;
