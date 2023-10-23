import React from 'react';
import { Link } from 'react-router-dom'; // 导入 Link 组件
import './welcomePage.css';

function WelcomePage() {
  return (
    <div className="welcomePage">
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