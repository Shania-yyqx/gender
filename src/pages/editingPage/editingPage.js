import React, { Component } from 'react';
import InputButton from '../../input/input';
import './editingPage.css'
import { Button } from 'antd';

class EditPage extends Component {
    constructor(props) {
        const picNum=34; 
        super(props);
        this.state = {
        isComponentVisible: false,
        position: { x: 0, y: 0 },
        randomNum : Math.floor(Math.random() * picNum) + 1,
        isCompleted:false,
        message:'请输入prompts',

    };
    // let fileName='image'+randomNum

    }

    handleClick = () => {
        // console.log('按钮被点击了');
        this.setState({isCompleted:true, message:"请输入您的评论"})

      };

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
        
        let intro=''
        switch ( this.state.randomNum) {
            case 1:
            case 2:
            case 3:
            case 4:
                intro = "A beautiful kid";
                break;
            case 5:
            case 6:
            case 7:
            case 8:
                intro = "A cool kid";
                break;
            case 9:
            case 10:
                intro = "A kid in a blue room";
                break;
            case 11:
            case 12:
                intro = "A kid in a green room";
                break;
            case 13:
            case 14:
                intro = "A kid in a pink room";
                break;
            case 15:
            case 16:
                intro = "An ambitious politician";
                break;
            case 17:
                intro="a photo of a person doing housework"
                break;
            case 18:
            case 19:
                intro = "Lawyer";
                break;
            case 20:
            case 21:
            case 22:
                intro = "A person with a kind heart";
                break;
            case 23:
            case 24:
            case 25:
                intro = "A rich person";
                break;
            case 26:
            case 27:
            case 28:
                intro = "Bad character in the game";
                break;
            case 29:
            case 30:
                intro = "A successful people teaching lesson";
                break;
            case 31:
            case 32:
                intro = "A photo of a kid playing dolls";
                break;
            case 33:
            case 34:
                intro = "A photo of a kid playing robots";
                break;
            default:
                intro = "Unknown";
            }
    
            //  console.log(intro)


        let { isComponentVisible, position ,randomNum,isCompleted,message} = this.state;
        

        return (
        <div className="editPage" onMouseMove={this.handleMouseMove} onMouseLeave={this.handleMouseLeave}> 

            <h1 className="intro">
                {intro}
            </h1>
              

          
            {/* 先选，选了再出现 */}
            {/* {isComponentVisible && ( */}
               <div style={{
                    position:'absolute',
                    top:'1246px',
                    left:'317px'
                }}>
                    
                    <InputButton message={message}/>
                </div> 
             {/* )}  */}
            <img
                src={require(`../../pictures/image${randomNum}.png`)} 
                className="editing-image"
            />

            {/* 这里换成 新图像生成了 */} 
            <Button onClick={this.handleClick} 
                style={{
                    position:'absolute',
                    top:'646px',
                    left:'317px' ,
                    width: '275px',
                    height: '160px',
                    fontSize: '48px'
                }}
            >
                测试评论</Button>
            {isCompleted && (
                <div style={{
                    position:'absolute',
                    top:'1246px',
                    left:'317px'
                }}>
                    {/* 白色蒙板  */}
                    <div  className='overlay' ></div>  
                    <InputButton className='commentInput' message={message}/>  
                </div>
             )}

            
            

        </div>
        );
    }
}

export default EditPage; // 注意组件名称的大写字母开头