import React, { Component } from 'react';
import { useHistory } from 'react-router-dom';
import {Button, Input, ConfigProvider, } from 'antd';
import './commentPage.css'; // 导入CSS样式文件'
import { connect } from 'react-redux';
import { addComment, updateCurrentImageID } from '../../redux/actions';  // 根据实际路径更新

class CommentPage extends Component {
  constructor(props) { 
    super(props);
    this.state = {
      inputValue: '',
      inputValueList:[],
      imagepath:this.props.imagepath
    };
    this.commentInputRef = React.createRef(); // 创建ref
  }

  // handleInputChange = (e) => {
  //   this.setState({
  //       inputValue: e.target.value,
  //   })
  // };

  handleButtonClick = () => {
      // 在这里使用inputValue
      // if (this.state.inputValue.length > 0){
      //   this.state.inputValueList.push(this.state.inputValue)
      //   console.log('Input Value:', this.state.inputValue);
      //   console.log('Input Value List:', this.state.inputValueList);
      // }
      const commentInputElement = this.commentInputRef.current.input;  // 获取原生的 input 元素
      var comment = ""
      console.log("commentInputElement:", commentInputElement);
      if (commentInputElement) {
        comment = commentInputElement.value;  // 获取输入值
        console.log("comment value:", comment);
      }
      this.props.addComment(this.props.currentImageIndex - 1, comment)
      const picNum=63; 
      var randomNum = Math.floor(Math.random() * picNum) + 1;
      this.props.updateCurrentImageID(randomNum)
      const history = this.props.history; 
      history.push('/edit');
  };


  render() {
    let{imagepath}=this.state
    let imageName = this.props.imageName;  
    console.log("commentPage this.props.currentImageIndex,", this.props.currentImageIndex)

    // 记录当前时间并转成时间戳
    let now = new Date().getTime();
    // 从缓存中获取用户上次退出的时间戳
    let leaveTime = parseInt(localStorage.getItem('leaveTime'), 10);
    // 判断是否为刷新，两次间隔在5s内判定为刷新操作
    let refresh = (now - leaveTime) <= 3000;
    // 测试alert
    if(refresh){
        this.props.history.push("/")
    }
    window.onbeforeunload = function(e){
        if(e) e.returnValue=("重新加载此网站？系统可能不会保存你所做的更改");
        return "重新加载此网站？??系统可能不会保存你所做的更改"

    }
    window.onunload = function(){
        localStorage.setItem('leaveTime', new Date().getTime());
    };
    let tipText='留下你的对性别偏见的感想'

    return (
      <div className="commentPage"> 
      {/* 获取到修改后的图片, image1换成imagepath */}
      <div className='tipicon'> 
        <svg width="102" height="102" viewBox="0 0 102 102" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M102 0H0V71.4H10.2V10.2H91.8V71.4H51V81.6H40.8V91.8H30.6V71.4H0V81.6H20.4V102H40.8V91.8H51V81.6H102V0Z" fill="#D9D9D9"/>
        </svg>
        </div>
        <span className='tips'>
            {tipText}
        </span>
        <img
            src={`http://localhost:6002/resultImages/${imageName}`} 
            className="edited-image"
            alt=''
        />
        <div style={{
          position:'absolute',
          top:1246,
          left:317
        }}>
          <div className="input-button">
                    <div style={{display:'flex'}}>
                    <ConfigProvider
                        theme={{
                        components: {
                            colorBorder:'#FFFFFF',
                            Button: {
                                defaultBorderColor:'#FFFFFF',
                            },
                            Input: {
                            //colorPrimary: '#eb2f96',
                            activeBorderColor:'#FFFFFF',
                            hoverBorderColor:'#FFFFFF',
                            colorBorder:'#FFFFFF',
                            }
                        },
                        }}
                    >
                        <Input 
                        // onChange={this.handleInputChange}
                        ref={this.commentInputRef}
                        style={{
                        width: '975px',
                        height: '160px',
                        borderRadius: '90px 0px 0px 90px',
                        paddingLeft:'48px',
                        fontSize: '48px',
                        fontFamily:"'fangzhengxiangsu', sans-serif",
                        }}
                        placeholder='请输入评论' />
                        <Button 
                        onKeyDown={this.handleButtonClick}
                        onClick={this.handleButtonClick}
                        // bordered
                        style={{
                            width: '180px',
                            height: '160px',
                            borderRadius: '0px 90px 90px 0px',
                            background: 'white',
                            
                        }}type="primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
                            <path d="M66.666 23.3333L33.3327 56.6667L16.666 40" stroke="#8D8D8D" strokeWidth="8.33333" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </Button>
                        </ConfigProvider>
                    </div>
            </div>
        </div>
        
      </div>
    );
  }
}

const mapStateToProps = state => ({
  imageName: state.imageName,
  commentList: state.commentList,
  currentImageIndex: state.currentImageIndex,
});

const mapDispatchToProps = dispatch => ({
  addComment: (imgIndex, commentValue) => dispatch(addComment(imgIndex, commentValue)),
  updateCurrentImageID: (currentImageIndex) => dispatch(updateCurrentImageID(currentImageIndex)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentPage);
// export default CommentPage; // 注意组件名称的大写字母开头
