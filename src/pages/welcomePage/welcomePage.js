import React from 'react';
import { Link } from 'react-router-dom'; // 导入 Link 组件
import './welcomePage.css';

function WelcomePage() {
  return (
    <div className="welcomePage">
      <div className="text-container">
          <Link to="/edit">          
            <p className="click2start">点击开始</p>
          </Link>
      </div>

      <div className="pics-container">
        {/* 圆圈 */}
        <img src={require(`./Ellipse.png`)} className="fixed-image" alt="Ellipse" />
        {/* 手 */}
        <img src={require(`./Vector.png`)} className="fixed-image-vector" alt="Vector" />
      </div>
    </div>
  );
}

export default WelcomePage;