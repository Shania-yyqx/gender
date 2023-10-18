import React, { Component } from 'react';
import './commentPage.css'; // 导入CSS样式文件
import InputButton from '../../input/input'
import { Spin } from 'antd';
class CommentPage extends Component {

  render() {
    return (
      <div className="commentPage"> 
      {/* 获取到修改后的图片 */}
      <p>commentPage</p>
         <img
            src={require(`../../pictures/image1.png`)} 
            className="edited-image"
            alt=''
         />
         {/* <InputButton className="input-button"/> */}
      </div>
    );
  }
}

export default CommentPage; // 注意组件名称的大写字母开头
