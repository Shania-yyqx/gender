import React, { Component } from 'react';
import './welcomePage.css'; // 导入CSS样式文件

class WelcomePage extends Component {

  // 定义处理点击事件的函数
  handleClick = () => {
    // 在这里触发您希望执行的操作或信号
    console.log('页面被点击了！');
  };

  componentDidMount() {
    // 在组件挂载时添加点击事件监听器
    document.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    // 在组件卸载时移除点击事件监听器，以避免内存泄漏
    document.removeEventListener('click', this.handleClick);
  }


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
          {/* 男女图标 */}
          <img
            src={require(`./gender.png`)} 
            className="fixed-image-gender"
          />
        </div>

      </div>
    );
  }
}

export default WelcomePage; // 注意组件名称的大写字母开头
