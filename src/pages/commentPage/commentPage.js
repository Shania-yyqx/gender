import React, { Component } from 'react';
import './commentPage.css'; // 导入CSS样式文件

class CommentPage extends Component {

  render() {
    return (
      <div className="commentPage"> 
      {/* 获取到修改后的图片 */}
         <img
            src={require(`../../pictures/image1.png`)} 
            className="edited-image"
         />



     

      </div>
    );
  }
}

export default CommentPage; // 注意组件名称的大写字母开头
