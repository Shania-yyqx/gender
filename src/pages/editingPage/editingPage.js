import React, { Component } from 'react';
import InputButton from '../../input/input';
import {Button, Input, Select, Space, ConfigProvider, Spin, Row, Col, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './editingPage.css'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { modifyNumList, setImageName, updateCurrentImageID } from '../../redux/actions';  // 根据实际路径更新

class EditPage extends Component {
    constructor(props) {
        const picNum=34; 
        super(props);
        this.state = {
            isComponentVisible: false,
            position: { x: 0, y: 0 },
            // randomNum : Math.floor(Math.random() * picNum) + 1,
            randomNum: this.props.currentImageIndex,
            isCompleted:false,
            message:'请输入prompts',
            drawing: false,
            mask: "",
            isLoading: false,
            isGenerated: false, //决定显示哪些按钮和图片
            isEnteredPrompt: false, //决定是否显示prompt输入框
            imageName: '',  // 新增一个状态用于存储生成的图片名称
            initImagesBase64: "", //初始图片的base64格式
            prompt : ""
        };
        // let fileName='image'+randomNum
        this.canvasRef = React.createRef();
        this.ctx = null;
        this.inputRef = React.createRef(); // 创建ref
        // Binding event handlers to `this`
        this.handlePointerDown = this.handlePointerDown.bind(this);
        this.handlePointerMove = this.handlePointerMove.bind(this);
        this.handlePointerUp = this.handlePointerUp.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        this.convertCanvasToBase64 = this.convertCanvasToBase64.bind(this);
        this.handleImageLoad = this.handleImageLoad.bind(this);
        this.handlePromptButtonClick = this.handlePromptButtonClick.bind(this);
        this.generateImageBySdAPI = this.generateImageBySdAPI.bind(this);
    }
    
    componentDidMount() {
        // 当组件挂载时，检查是否是由于页面刷新导致的
        // if (window.performance.navigation.type === 1) {
        //     this.props.history.push('/');
        //   }
        // Initialize the canvas context when the component mounts
        this.ctx = this.canvasRef.current.getContext('2d');

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
        // console.log("in handlePointerMove")
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
        // const mask = await this.drawMask(this.canvasRef.current, document.querySelector('.editing-image'));
        // // console.log(mask);  // 打印遮罩图像的base64
        // this.convertCanvasToBase64(mask);
        // this.setState({ mask: mask });
        // 显示出prompt输入框
        // this.setState({
        //     isComponentVisible: true,
        // })
    };

    handleDoubleClick = async () => {
        console.log("in handleDoubleClick")
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
    
    
    convertCanvasToBase64 = (img) => {
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
            body: JSON.stringify({ imageData: img })
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
        // canvas.width = img.width;
        // canvas.height = img.height;
        if (canvas.width !== img.width || canvas.height !== img.height) {
            console.log("in handleImageLoad canvas.width !== img.width || canvas.height !== img.height")
            console.log("in handleImageLoad canvas", canvas)
            console.log("in handleImageLoad img", img)
            canvas.width = img.width;
            canvas.height = img.height;
        }
    };
    
    async handlePromptButtonClick() {
        console.log("in handlePromptButtonClick")
        const { randomNum, mask } = this.state;
        const currentImageIndex = this.props.currentImageIndex
        
        const imageSrc = require(`../../pictures/image${currentImageIndex}.png`);
        // // 将图片转为base64格式
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
            initImagesBase64: imageToBase64,
            prompt: prompt,
            isLoading: true,
            // isEnteredPrompt: true,
          }, () => {
            this.generateImageBySdAPI();
          });

        // this.generateImageBySdAPI()
    }

    generateImageBySdAPI(){
        console.log("this.state:", this.state)
        const payload = {
            "init_images": [this.state.initImagesBase64],
            "prompt": this.state.prompt,
            "width": 325,
            "height": 543,
            "mask": this.state.mask,
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

        // const imageID = this.state.randomNum;
        const imageID = this.props.currentImageIndex
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
            // this.ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
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
                isEnteredPrompt: true,
                imageName: data.imageName  // 更新 imageName 状态
            });
            // 让canvas上的路径暂时不可见
            this.canvasRef.current.style.visibility = 'hidden';
            // // 清除canvas上现有的路径
            // this.ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
        })
        .catch(error => {
            console.error('错误:', error)
            this.setState({
                isLoading: false,
                // isComponentVisible: false
                // 到中间页重新生成
                isComponentVisible: true,
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
        // switch ( this.state.randomNum) {
        //     case 1:
        //     case 2:
        //     case 3:
        //     case 4:
        //         intro = "A beautiful kid";
        //         break;
        //     case 5:
        //     case 6:
        //     case 7:
        //     case 8:
        //         intro = "A cool kid";
        //         break;
        //     case 9:
        //     case 10:
        //         intro = "A kid in a blue room";
        //         break;
        //     case 11:
        //     case 12:
        //         intro = "A kid in a green room";
        //         break;
        //     case 13:
        //     case 14:
        //         intro = "A kid in a pink room";
        //         break;
        //     case 15:
        //     case 16:
        //         intro = "An ambitious politician";
        //         break;
        //     case 17:
        //         intro="a photo of a person doing housework"
        //         break;
        //     case 18:
        //     case 19:
        //         intro = "Lawyer";
        //         break;
        //     case 20:
        //     case 21:
        //     case 22:
        //         intro = "A person with a kind heart";
        //         break;
        //     case 23:
        //     case 24:
        //     case 25:
        //         intro = "A rich person";
        //         break;
        //     case 26:
        //     case 27:
        //     case 28:
        //         intro = "Bad character in the game";
        //         break;
        //     case 29:
        //     case 30:
        //         intro = "A successful people teaching lesson";
        //         break;
        //     case 31:
        //     case 32:
        //         intro = "A photo of a kid playing dolls";
        //         break;
        //     case 33:
        //     case 34:
        //         intro = "A photo of a kid playing robots";
        //         break;
        //     default:
        //         intro = "Unknown";
        //     }
    
        console.log("in edit page")
        let { isComponentVisible, position ,randomNum,isCompleted,message} = this.state;

        let intro=''
        const currentImageIndex = this.props.currentImageIndex
        // console.log("this.state.randomNum:", randomNum)
        // console.log("this.props.currentImageIndex,", this.props.currentImageIndex)
        // console.log("this.props.commentList,", this.props.commentList)
        // if(randomNum > 0){
        //     intro = this.props.commentList[randomNum - 1][0]
        // }
        if(currentImageIndex > 0){
            intro = this.props.commentList[currentImageIndex - 1][0]
        }

        // const modifyNum = this.props.modifyNumList[randomNum-1] + 1;
        const modifyNum = this.props.modifyNumList[currentImageIndex-1] + 1;
        // console.log("commentList:", this.props.commentList)
    
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
                                        // left:'317px',
                                        left: "50%", 
                                        transform: "translate(-50%, -50%)",
                                        zIndex: 10
                                    }}>
                                    {this.state.isEnteredPrompt ? 
                                        (
                                            <Row justify="space-between" style={{width: "900px"}}>
                                                <Col>
                                                    <Tooltip title="Repaint"  overlayStyle={{ fontSize: "45px"}}>
                                                        <Button 
                                                            shape="circle" 
                                                            style={{width: '170px', height: '170px' }}
                                                            onClick={() => {
                                                                this.setState({ 
                                                                    isGenerated: false,
                                                                    isComponentVisible: false,
                                                                    isEnteredPrompt: false ,
                                                                    mask: ""
                                                                });  
                                                                this.canvasRef.current.style.visibility = 'visible';
                                                                // 清除canvas上现有的路径
                                                                this.ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
                                                            }}
                                                        >
                                                            <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M45.3422 0H39.6744V5.66777H34.0066V11.3355H28.3389V17.0033H22.6711V22.6711H17.0033V28.3389H11.3355V34.0066H5.66777V39.6744H0V56.6777H17.0033V51.01H22.6711V45.3422H28.3389V39.6744H34.0066V34.0066H39.6744V28.3389H45.3422V22.6711H51.01V17.0033H56.6777V11.3355H51.01V5.66777H45.3422V0ZM45.3422 22.6711H39.6744V28.3389H34.0066V34.0066H28.3389V39.6744H22.6711V45.3422H17.0033V39.6744H11.3355V34.0066H17.0033V28.3389H22.6711V22.6711H28.3389V17.0033H34.0066V11.3355H39.6744V17.0033H45.3422V22.6711ZM11.3355 39.6744H5.66777V51.01H17.0033V45.3422H11.3355V39.6744Z" fill="#818181"/>
                                                            </svg>
                                                        </Button>
                                                    </Tooltip>
                                                </Col>
                                                <Col>
                                                    <Tooltip title="Re-enter prompt" overlayStyle={{ fontSize: "45px"}}>
                                                        <Button 
                                                            shape="circle" 
                                                            style={{width: '170px', height: '170px' }}
                                                            onClick={() => {
                                                                this.setState({ isEnteredPrompt: false });  
                                                                this.canvasRef.current.style.visibility = 'visible';
                                                            }}
                                                        >
                                                            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M63.9972 0H0V63.9972H63.9972V0ZM7.1108 56.8864V7.1108H56.8864V56.8864H7.1108ZM21.3324 14.2216H14.2216V21.3324H21.3324V14.2216ZM49.7756 42.6648H14.2216V49.7756H49.7756V42.6648ZM42.6648 14.2216H49.7756V21.3324H42.6648V14.2216ZM35.554 14.2216H28.4432V21.3324H35.554V14.2216ZM14.2216 28.4432H21.3324V35.554H14.2216V28.4432ZM49.7756 28.4432H42.6648V35.554H49.7756V28.4432ZM28.4432 28.4432H35.554V35.554H28.4432V28.4432Z" fill="#999999"/>
                                                            </svg>
                                                        </Button>
                                                    </Tooltip>
                                                </Col>
                                                <Col>
                                                    <Tooltip title="Regenerate" overlayStyle={{ fontSize: "45px"}}>
                                                        <Button 
                                                            shape="circle" 
                                                            style={{width: '170px', height: '170px' }}
                                                            onClick={() => {
                                                                this.setState({ 
                                                                    isGenerated: false,
                                                                    isLoading: true,
                                                                });  // 重置isGenerated状态以重新生成图片
                                                                this.canvasRef.current.style.visibility = 'visible';
                                                                this.generateImageBySdAPI();
                                                            }}
                                                        >
                                                            <svg width="66" height="66" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M45.8382 0H39.2899V6.54832H45.8382V13.0966H6.54832V19.645H0V36.0158H6.54832V19.645H45.8382V26.1933H39.2899V32.7416H45.8382V26.1933H52.3865V19.645H58.9349V13.0966H52.3865V6.54832H45.8382V0ZM13.0966 58.9349H19.645V65.4832H26.1933V58.9349H19.645V52.3865H58.9349V45.8382H65.4832V29.4674H58.9349V45.8382H19.645V39.2899H26.1933V32.7416H19.645V39.2899H13.0966V45.8382H6.54832V52.3865H13.0966V58.9349Z" fill="#999999"/>
                                                            </svg>
                                                        </Button>
                                                    </Tooltip>
                                                </Col>
                                                <Col>
                                                    <Tooltip title="Finish" overlayStyle={{ fontSize: "45px"}}>
                                                        <Button 
                                                            shape="circle" 
                                                            style={{width: '170px', height: '170px' }} 
                                                            onClick={() => {
                                                                this.props.modifyNumListAction(currentImageIndex-1, modifyNum);
                                                                this.props.history.push('/comment');
                                                                // 清除canvas上现有的路径
                                                                this.ctx.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
                                                            }}
                                                        >
                                                            <svg width="67" height="52" viewBox="0 0 67 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <g filter="url(#filter0_d_200_1057)">
                                                                <path d="M55.3339 0H62.6673V7.33341H55.3339V0ZM48.0005 14.6668V7.33341H55.3339V14.6668H48.0005ZM40.6671 22.0002V14.6668H48.0005V22.0002H40.6671ZM33.3337 29.3337H40.6671V22.0002H33.3337V29.3337ZM26.0002 36.6671H33.3337V29.3337H26.0002V36.6671ZM18.6668 36.6671V44.0005H26.0002V36.6671H18.6668ZM11.3334 29.3337H18.6668V36.6671H11.3334V29.3337ZM11.3334 29.3337H4V22.0002H11.3334V29.3337Z" fill="#818181"/>
                                                                </g>
                                                                <defs>
                                                                <filter id="filter0_d_200_1057" x="0" y="0" width="66.668" height="52.0005" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                                                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                                                <feOffset dy="4"/>
                                                                <feGaussianBlur stdDeviation="2"/>
                                                                <feComposite in2="hardAlpha" operator="out"/>
                                                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                                                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_200_1057"/>
                                                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_200_1057" result="shape"/>
                                                                </filter>
                                                                </defs>
                                                            </svg>
                                                        </Button>
                                                    </Tooltip>
                                                </Col>
                                            </Row>
                                        )
                                        :
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
                                                    width: this.state.isGenerated ? '790px' : '975px',  // 根据 isGenerated 的值动态设置 width
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
                                                    onClick={this.handlePromptButtonClick} 
                                                >
                                                    <svg width="67" height="52" viewBox="0 0 67 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <g filter="url(#filter0_d_200_1057)">
                                                                <path d="M55.3339 0H62.6673V7.33341H55.3339V0ZM48.0005 14.6668V7.33341H55.3339V14.6668H48.0005ZM40.6671 22.0002V14.6668H48.0005V22.0002H40.6671ZM33.3337 29.3337H40.6671V22.0002H33.3337V29.3337ZM26.0002 36.6671H33.3337V29.3337H26.0002V36.6671ZM18.6668 36.6671V44.0005H26.0002V36.6671H18.6668ZM11.3334 29.3337H18.6668V36.6671H11.3334V29.3337ZM11.3334 29.3337H4V22.0002H11.3334V29.3337Z" fill="#818181"/>
                                                                </g>
                                                                <defs>
                                                                <filter id="filter0_d_200_1057" x="0" y="0" width="66.668" height="52.0005" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                                                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                                                <feOffset dy="4"/>
                                                                <feGaussianBlur stdDeviation="2"/>
                                                                <feComposite in2="hardAlpha" operator="out"/>
                                                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                                                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_200_1057"/>
                                                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_200_1057" result="shape"/>
                                                                </filter>
                                                                </defs>
                                                    </svg>
                                                </Button>
                                                </ConfigProvider>
                                            </div>
                                        </div>
                                    }    
                                </div> 
                            )
                            } 
                            {/* ?${new Date().getTime()} 是一个查询参数，它会随着每次组件重新渲染而改变，从而确保浏览器认为这是一个新的 URL 并重新从服务器加载图片，而不是使用缓存的版本 */}
                            {this.state.isGenerated ? (
                                <img
                                    src={`http://localhost:6002/resultImages/${this.state.imageName}?${new Date().getTime()}`} 
                                    className="editing-image"
                                    alt=""
                                />
                            ) : (
                                <img
                                    src={require(`../../pictures/image${currentImageIndex}.png`)} 
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
                                onDoubleClick={this.handleDoubleClick}
                                // onPointerLeave={this.handlePointerUp}
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
    imageName: state.imageName,
    commentList: state.commentList,
    currentImageIndex: state.currentImageIndex,
  });
  
// const mapStateToProps = state => {
//   console.log("mapStateToProps state:", state);
//   return {
//     modifyNumList: state.modifyNumList,
//     imageName: state.imageName,
//     commentList: state.commentList,
//     currentImageIndex: state.currentImageIndex,
//   };
// };

const mapDispatchToProps = dispatch => ({
    modifyNumListAction: (index, value) => dispatch(modifyNumList(index, value)),
    setImageNameAction: (name) => dispatch(setImageName(name)),
    updateCurrentImageID: (currentImageIndex) => dispatch(updateCurrentImageID(currentImageIndex)),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(EditPage));

// // export default EditPage; // 注意组件名称的大写字母开头
// export default withRouter(EditPage);

