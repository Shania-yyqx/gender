import React, { Component } from 'react';
import InputButton from '../../input/input';
import {Button, Input, Select, Space, ConfigProvider, Spin } from 'antd';
import './editingPage.css'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { modifyNumList, setImageName } from '../../redux/actions';  // 根据实际路径更新

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
            isGenerated: false, //决定显示哪些按钮和图片
            imageName: '',  // 新增一个状态用于存储生成的图片名称
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
        // antd的input组件不能直接通过 this.inputRef.current.value 取值
        // const prompt = this.inputRef.current.value ? this.inputRef.current.value : "";
        // console.log("this.inputRef.current.value:", this.inputRef.current.value)
        const inputElement = this.inputRef.current.input;  // 获取原生的 input 元素
        var prompt = ""
        console.log("inputElement:", inputElement);
        if (inputElement) {
          prompt = inputElement.value;  // 获取输入值
          console.log("Prompt value:", prompt);
        }

        this.setState({
            isLoading: true
        })

        const payload = {
            "init_images": [imageToBase64],
            "prompt": prompt,
            "width": 325,
            "height": 543,
            "mask": mask,
            "batch_size": 1,
            "denoising_strength": 0.6,  //重绘幅度
            "mask_blur": 45,  //蒙版模糊
            "inpainting_fill": 1,  //蒙版遮住的内容， 0填充， 1原图 2潜空间噪声 3潜空间数值零
            "inpaint_full_res": false,  //inpaint area, False: whole picture True：only masked
            "cfg_scale": 10,
            "steps": 25,
            "sampler_name": "DPM++ 2S a Karras"
        };
        console.log("payload:", payload)

        const imageID = randomNum;
        const modifyNum = this.props.modifyNumList[imageID-1] + 1;

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
            this.ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
            this.props.setImageNameAction( data.imageName);
            // this.props.modifyNumListAction(imageID-1, modifyNum);
            // // http://localhost:6002/resultImages/image8-2.png
            // this.setState({
            //     isLoading: false,
            //     isComponentVisible: false
            // })
            // this.props.history.push('/comment');
            this.setState({
                isLoading: false,
                isGenerated: true,  // 设置为 true 表示已生成图片
                imageName: data.imageName  // 更新 imageName 状态
            });
            // 清除canvas上现有的路径
            // this.ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
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

        const modifyNum = this.props.modifyNumList[randomNum-1] + 1;
        

        return (
            <div className="editPage" onMouseMove={this.handleMouseMove} onMouseLeave={this.handleMouseLeave}> 
                 <ConfigProvider
                    theme={{
                        components: {
                            Spin: {
                                contentHeight:  2587,
                                dotSize: 300,
                                colorPrimary: "white"
                            }
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
                                                // width: '975px',
                                                width: this.state.isGenerated ? '795px' : '975px',  // 根据 isGenerated 的值动态设置 width
                                                height: '160px',
                                                borderRadius: '90px 0px 0px 90px',
                                                paddingLeft:'48px',
                                                fontSize: '48px'
                                                }}
                                                placeholder="请输入prompts" 
                                            />
                                            {/* <Button 
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
                                            </Button> */}
                                              {this.state.isGenerated ? (
                                                <div>
                                                    <Button 
                                                        style={{
                                                            width: '180px',
                                                            height: '160px',
                                                            borderRadius: '0px 0px 0px 0px',
                                                            background: 'white',
                                                            
                                                        }}
                                                        onClick={() => {
                                                            this.setState({ isGenerated: false });  // 重置isGenerated状态以重新生成图片
                                                            this.handleButtonClick();
                                                        }}
                                                    >
                                                        {/* < img src={require(`../../pictures/icon.png` ) } alt="Icon"   
                                                                style={{
                                                                width: '100%', // 图像宽度与按钮宽度相同
                                                                height: '100%', // 图像高度与按钮高度相同
                                                            }}/> */}
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
                                                            <path d="M66.666 23.3333L33.3327 56.6667L16.666 40" stroke="#8D8D8D" strokeWidth="8.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </Button>
                                                    <Button 
                                                        style={{
                                                            width: '180px',
                                                            height: '160px',
                                                            borderRadius: '0px 90px 90px 0px',
                                                            background: 'white',
                                                            
                                                        }}
                                                        onClick={() => {
                                                            this.props.modifyNumListAction(randomNum-1, modifyNum);
                                                            this.props.history.push('/comment');
                                                        }}
                                                    >
                                                         <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
                                                            <path d="M66.666 23.3333L33.3327 56.6667L16.666 40" stroke="#8D8D8D" strokeWidth="8.33333" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </Button>  
                                                </div>
                                            ):
                                            (<Button 
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
                                            )
                                            }
                                            </ConfigProvider>
                                        </div>
                                </div>
                                </div> 
                            )} 

                            {/* <img
                                src={require(`../../pictures/image${randomNum}.png`)} 
                                className="editing-image"
                                onLoad={this.handleImageLoad}
                                alt=""
                            /> */}
                            {this.state.isGenerated ? (
                                <img
                                    src={`http://localhost:6002/resultImages/${this.state.imageName}`} 
                                    className="editing-image"
                                    alt=""
                                />
                            ) : (
                                <img
                                    src={require(`../../pictures/image${randomNum}.png`)} 
                                    className="editing-image"
                                    onLoad={this.handleImageLoad}
                                    alt=""
                                />
                            )}
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

const mapStateToProps = state => ({
    modifyNumList: state.modifyNumList,
    imageName: state.imageName
  });
  
const mapDispatchToProps = dispatch => ({
    modifyNumListAction: (index, value) => dispatch(modifyNumList(index, value)),
    setImageNameAction: (name) => dispatch(setImageName(name))
});
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditPage));

// // export default EditPage; // 注意组件名称的大写字母开头
// export default withRouter(EditPage);

