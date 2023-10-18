import React, { Component } from 'react';
import InputButton from '../../input/input';
import {Button, Input, Select, Space, ConfigProvider, Spin } from 'antd';
import './editingPage.css'
import { withRouter } from 'react-router-dom';


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
            drawing: false,
            mask: "",
            isLoading: false,
        };
        // let fileName='image'+randomNum
        this.canvasRef = React.createRef();
        this.ctx = null;
        this.inputRef = React.createRef(); // 创建ref
        // Binding event handlers to `this`
        this.handlePointerDown = this.handlePointerDown.bind(this);
        this.handlePointerMove = this.handlePointerMove.bind(this);
        this.handlePointerUp = this.handlePointerUp.bind(this);
        this.convertCanvasToBase64 = this.convertCanvasToBase64.bind(this);
        this.handleImageLoad = this.handleImageLoad.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }
    
    componentDidMount() {
        // Initialize the canvas context when the component mounts
        this.ctx = this.canvasRef.current.getContext('2d');
        // this.ctx.fillStyle = "black";
        // this.ctx.fillRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
    }

    handlePointerDown = (e) => {
        console.log("in handlePointerDown")
        // this.ctx = this.canvasRef.current.getContext('2d');
        // Set the stroke properties
        this.ctx.strokeStyle = 'black';  // Setting the stroke color to white so it's visible on black
        this.ctx.lineWidth = 75;          // Setting a width for the stroke
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        this.setState({ drawing: true });
      };
    
    handlePointerMove = (e) => {
        console.log("in handlePointerMove")
        if (this.state.drawing) {
          this.ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
          this.ctx.stroke();
        }
    };

    async drawMask(_canvas, _image) {
        return new Promise(async (resolve) => {
          const canvas = _canvas;
          const ctx = canvas.getContext('2d');
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const imageDataContent = imageData.data;
    
          for (let i = 0; i < imageDataContent.length; i += 4) {
            if (imageDataContent[i] === 0 && imageDataContent[i + 1] === 0 && imageDataContent[i + 2] === 0 && imageDataContent[i + 3] !== 0) { // Detects drawn black color
                imageDataContent[i] = 255;      // Change to white
                imageDataContent[i + 1] = 255;
                imageDataContent[i + 2] = 255;
            } else {
                imageDataContent[i] = 0;        // Change to black
                imageDataContent[i + 1] = 0;
                imageDataContent[i + 2] = 0;
                imageDataContent[i + 3] = 255;  // Ensure it's not transparent
            }
        }
        
    
          const exportCanvas = document.createElement('canvas');
          exportCanvas.width = canvas.width;
          exportCanvas.height = canvas.height;
          const exportCtx = exportCanvas.getContext('2d');
          exportCtx.putImageData(imageData, 0, 0);
    
          const size = await this.getImageOriginSize(_image);
          const finalMask = await this.scaleImage(exportCanvas.toDataURL(), size.width, size.height);
          resolve(finalMask);
        });
      }
    
    getImageOriginSize(img) {
        return new Promise((resolve, reject) => {
          const i = new Image();
          i.onload = () => {
            resolve({ width: i.width, height: i.height });
          };
          i.onerror = reject;
          i.src = img.src;
        });
    }
    
    scaleImage(dataURL, width, height) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL());
          };
          img.onerror = reject;
          img.src = dataURL;
        });
    }
    
    handlePointerUp = async () => {
        console.log("in handlePointerUp")
        this.setState({ drawing: false });
        const mask = await this.drawMask(this.canvasRef.current, document.querySelector('.editing-image'));
        // console.log(mask);  // 打印遮罩图像的base64
        this.convertCanvasToBase64(mask);
        this.setState({ mask: mask });
        // 显示出prompt输入框
        this.setState({
            isComponentVisible: true,
        })
    };
    
    
    convertCanvasToBase64 = (mask) => {
        console.log("in convertCanvasToBase64")
        const base64Image = this.canvasRef.current.toDataURL("image/png");
        // console.log("base64Image:", base64Image)
        // Process the base64Image as required
        // 通过node js server保存图片
        fetch('http://localhost:6002/saveCanvasImage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageData: mask })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    };


    handleClick = () => {
        this.setState({isCompleted:true, message:"请输入您的评论"})
    };

    // handleMouseMove = (e) => {
    // this.setState({
    //     position: { x: e.clientX, y: e.clientY },
    //     isComponentVisible: true,
    // });
    // };

    // handleMouseLeave = () => {
    // this.setState({
    //     isComponentVisible: false,
    // })

    // };

    handleImageLoad = (e) => {
        const img = e.target;
        const canvas = this.canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
    };
    
    async handleButtonClick() {
        console.log("in handleButtonClick")
        const { randomNum, mask } = this.state;
        
        const imageSrc = require(`../../pictures/image${randomNum}.png`);
        // 将图片转为base64格式
        const imageToBase64 = await this.convertImageToBase64(imageSrc);
        // 获取Input的内容
        // console.log("before this.inputRef.current.value")
        const prompt = this.inputRef.current.value ? this.inputRef.current.value : "";
        // console.log("this.inputRef.current.value:", this.inputRef.current.value)

        this.setState({
            isLoading: true
        })
        // const imageSrcTest =
        // const maskToBase64Test = await this.convertImageToBase64(imageSrc);

        // 设置请求体
        // const payload = {
        //     "init_images": [imageToBase64],
        //     "prompt": prompt,
        //     "width": this.canvasRef.current.width,
        //     "height": this.canvasRef.current.height,
        //     "mask": mask,
        //     "batch_size": 1,
        // };
        const payload = {
            "init_images": [imageToBase64],
            "prompt": prompt,
            "width": 325,
            "height": 543,
            "mask": mask,
            "batch_size": 1,
            "denoising_strength": 0.6,  //重绘幅度
            "inpaint_full_res": false,  //inpaint area, False: whole picture True：only masked
            "cfg_scale": 3,
            "steps": 25,
            "sampler_name": "DPM++ 2S a Karras"
        };
        console.log("payload:", payload)

        const imageID = randomNum;
        const modifyNum = 2;

        // 发送请求
        // 为了避免跨域请求，在服务端调用sd
        fetch('http://localhost:6002/generateImagebySD', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ payload, imageID, modifyNum })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); // 这里将返回“Image saved successfully”、图片名或错误消息
            console.log('imageName:', data.imageName);  // 输出图片名称
            this.setState({
                isLoading: false,
                isComponentVisible: false
            })
            this.props.history.push('/comment');
        })
        .catch(error => {
            console.error('错误:', error)
            this.setState({
                isLoading: false,
                isComponentVisible: false
            })
        });
    }

    // 新增的函数，将图片转为base64格式
    convertImageToBase64(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = this.width;
                canvas.height = this.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(this, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            img.src = src;
        });
    }


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
    

        let { isComponentVisible, position ,randomNum,isCompleted,message} = this.state;
        

        return (
            <div className="editPage" onMouseMove={this.handleMouseMove} onMouseLeave={this.handleMouseLeave}> 
                 <ConfigProvider
                    theme={{
                        token: {
                            contentHeight:  2587,
                            dotSize: 400
                        },
                    }}
                >
                <Spin spinning={this.state.isLoading} style={{height: "2587px", zIndex: 15}}>
                    <div>
                            <h1 className="intro">
                                {intro}
                            </h1>
                            
                            {/* 先选，选了再出现 */}
                            {isComponentVisible && (
                            <div style={{
                                    position:'absolute',
                                    top:'1246px',
                                    left:'317px',
                                    zIndex: 10
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
                                                ref={this.inputRef}
                                                style={{
                                                width: '975px',
                                                height: '160px',
                                                borderRadius: '90px 0px 0px 90px',
                                                paddingLeft:'48px',
                                                fontSize: '48px'
                                                }}
                                                placeholder="请输入prompts" 
                                            />
                                            <Button 
                                                // bordered
                                                style={{
                                                    width: '180px',
                                                    height: '160px',
                                                    borderRadius: '0px 90px 90px 0px',
                                                    background: 'white',
                                                    
                                                }}
                                                type="primary"
                                                onClick={this.handleButtonClick} 
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
                                                    <path d="M66.666 23.3333L33.3327 56.6667L16.666 40" stroke="#8D8D8D" strokeWidth="8.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </Button>
                                            </ConfigProvider>
                                        </div>
                                </div>
                                </div> 
                            )} 

                            <img
                                src={require(`../../pictures/image${randomNum}.png`)} 
                                className="editing-image"
                                onLoad={this.handleImageLoad}
                                alt=""
                            />
                            <canvas 
                                ref={this.canvasRef}
                                className="editing-image" // the canvas should have same CSS as your img to overlay perfectly
                                onPointerDown={this.handlePointerDown}
                                onPointerMove={this.handlePointerMove}
                                onPointerUp={this.handlePointerUp}
                                onPointerLeave={this.handlePointerUp}
                            />
                        </div>
                </Spin>
                </ConfigProvider>
            </div>
        );
    }
}

// export default EditPage; // 注意组件名称的大写字母开头
export default withRouter(EditPage);