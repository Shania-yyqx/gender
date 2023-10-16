import React, { Component } from 'react';
import './welcomePage.css'; // 导入CSS样式文件

class WelcomePage extends Component {
  render() {
    return (
      <div className="welcomePage"> 

        <div className="text-container">
          <h1 className="name">
            偏偏 <br/>
            偏见 <br/>
            见到你
          </h1>
          <p className="intro-text">今天，你遇到偏见了吗？</p>
          <p className="click2start">点击开始</p>
        </div>

        <div className="pics-container">
          {/* 圆圈 */}
          <img
            src={require(`./Ellipse.png`)} 
            className="fixed-image"
          />
          {/* 手 */}
          <img
            src={require(`./Vector.png`)} 
            className="fixed-image-vector"
          />
        </div>

      </div>
    );
  }
}

export default WelcomePage; // 注意组件名称的大写字母开头
