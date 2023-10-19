import React, { Component } from 'react';
import { useHistory } from 'react-router-dom';
import {Button, Input, ConfigProvider, } from 'antd';
import './commentPage.css'; // 导入CSS样式文件'
import { connect } from 'react-redux';

class CommentPage extends Component {
  constructor(props) { 
    super(props);
    this.state = {
      inputValue: '',
      inputValueList:[],
      imagepath:this.props.imagepath
  };}

  handleInputChange = (e) => {
    this.setState({
        inputValue: e.target.value,
    })
  };

  handleButtonClick = () => {
      // 在这里使用inputValue
      if (this.state.inputValue.length > 0){
        this.state.inputValueList.push(this.state.inputValue)
        console.log('Input Value:', this.state.inputValue);
        console.log('Input Value List:', this.state.inputValueList);
      }
      const history = this.props.history;
      history.push('/');
  };


  render() {
    let{imagepath}=this.state
    let imageName = this.props.imageName;  

    return (
      <div className="commentPage"> 
      {/* 获取到修改后的图片, image1换成imagepath */}
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
                        onChange={this.handleInputChange}
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
  imageName: state.imageName
});

export default connect(mapStateToProps)(CommentPage);
// export default CommentPage; // 注意组件名称的大写字母开头
