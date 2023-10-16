import React, { Component } from 'react';
import {Button, Input, Select, Space, ConfigProvider, } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

class InputButton extends Component {
    render() {
      // Array of image filenames (replace with your image filenames)
        const imageFileNames = 'image1.png'
    
        return (
            <div className="input-button">
                    <div
                    style={{
                        display:'flex'
                        }}
                    >
                        <Input 
                        bordered='false'
                        style={{
                        width: '975px',
                        height: '160px',
                        borderRadius: '90px 0px 0px 90px',
                        paddingLeft:'48px',
                        fontSize: '48px'
                        }}
                    defaultValue="|输入prompt" />
                    <ConfigProvider
                        theme={{
                        token: {
                        borderColorDisabled: 'false',
                        },
                        }}
                    >
                        <Button 
                        bordered
                        borderColorDisabled='false'
                        style={{
                            width: '180px',
                            height: '160px',
                            borderRadius: '0px 90px 90px 0px',
                            background: 'white',
                            
                        }}type="primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
                            <path d="M66.666 23.3333L33.3327 56.6667L16.666 40" stroke="#8D8D8D" stroke-width="8.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </Button>
                        </ConfigProvider>
                    </div>
            </div>
        );
    }
  }
  
  export default InputButton;
  