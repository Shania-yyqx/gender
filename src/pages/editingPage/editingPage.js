import React, { Component } from 'react';
import InputButton from '../../input/input';
import './editingPage.css'

class EditPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        isComponentVisible: false,
        position: { x: 0, y: 0 },
    };
    }

    handleMouseMove = (e) => {
    this.setState({
        position: { x: e.clientX, y: e.clientY },
        isComponentVisible: true,
    });
    };

    handleMouseLeave = () => {
    this.setState({
        isComponentVisible: false,
    })

    };

    render() {
        const { isComponentVisible, position } = this.state;
        return (
        <div className="editPage" onMouseMove={this.handleMouseMove} onMouseLeave={this.handleMouseLeave}> 

            <div className="text-container">
            <h1 className="name">
                偏偏 <br/>
                偏见 <br/>
                见到你
            </h1>
            <p className="intro-text">今天，你遇到偏见了吗？</p>
            </div>
            {/* 先选，选了再出现 */}
            {/* {isComponentVisible && ( */}
               <div style={{
                    position:'absolute',
                    top:'1246px',
                    left:'317px'
                }}>
                    <InputButton/>
                </div> 
            {/* )} */}
            <img
                src={require(`../../pictures/image1.png`)} 
                className="editing-image"
            />

        </div>
        );
    }
}

export default EditPage; // 注意组件名称的大写字母开头