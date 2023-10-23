import React from 'react';
// import { Link } from 'react-router-dom'; // 导入 Link 组件
import { useHistory } from 'react-router-dom'; // 导入 useHistory Hook
import './welcomePage.css';

function WelcomePage() {

  const history = useHistory(); // 获取 history 对象

  const handleClick = () => {
    history.push('/edit'); // 在点击事件触发时改变路由
  }

  console.log("in WelcomePage")
  return (
    <div className="welcomePage" onClick={handleClick}>
        <img
          src={require(`./gendergif.gif`)} 
          alt="Git Video"
          width={5120}
          height={2880}
        />
    </div>
  );
}

export default WelcomePage;