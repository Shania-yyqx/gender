import React, { Component } from 'react';
import './pageIcons.css'; // 导入CSS样式文件

class PageIcons extends Component {


  render() {
    return (
      <div className="pageIcons"> 

        <div className="text-container">
          <h1 className="name">
            偏偏 <br/>
            偏见 <br/>
            见到你
          </h1>
          <p className="intro-text">今天，你遇到偏见了吗？</p>
        </div>

        <div className="pics-container">
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

export default PageIcons; // 注意组件名称的大写字母开头
