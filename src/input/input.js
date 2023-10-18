import React, { Component } from 'react';
import {Button, Input, Select, Space, ConfigProvider, } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

class InputButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
        inputValue: '',
        text:this.props.message
    };}

    handleInputChange = (e) => {
        this.setState({
            isComponentVisible: e.target.value,
        })
    };
    
    handleButtonClick = () => {
        // 在这里使用inputValue
        console.log('Input Value:', this.state.inputValue);
    };

    render() {
        const {text}=this.state
        return (
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
                        defaultValue={text} />
                        <Button 
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
        );
    }
  }
  
  export default InputButton;
  