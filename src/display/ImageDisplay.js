import React, { Component } from 'react';
import { Image } from 'antd';

class ImageDisplay extends Component {


  render() {
    // Array of image filenames (replace with your image filenames)
    let fileNum = 34;

    const imagesData = [];
    //记录每张图被修改的次数 
    console.log("接受到了文件=====----0000=",this.props)
    let modifiedNum=this.props.modifiedNum;

    if (modifiedNum==null){
      modifiedNum=Array(fileNum).fill(0);
    }

    for (let i = 1; i <= fileNum; i++) {
      const originalImage = `image${i}.png`;
      const modifiedImages = [];
      for(let j=1; j<modifiedNum[i-1]+1;j++){
        modifiedImages.push(`image${i}-${j}.png`);
      }
      imagesData.push([originalImage, ...modifiedImages]);
    }


    const containerStyle = {
      marginTop: '180px', // Adjust the margin as needed
      marginLeft: '140px',
      maxHeight: '88%',
      overflow: 'auto',
    };

    const imageStyle = {
      marginRight: '70px', // Adjust the spacing between images as needed
      marginBottom: '40px',
    };

    return (
      <div className="image-display" style={containerStyle}>
        {imagesData.map((imageRow, rowIndex) => (
          <div key={rowIndex} className="image-row" style={{ display: 'flex' }}>
            {imageRow.map((imageFileName, colIndex) => (
              <div
                key={colIndex}
                className="image-container"
                style={colIndex < imageRow.length - 1 ? { marginRight: '70px', marginBottom: '40px' } : imageStyle}
              >
                <Image
                  src={require(`../pictures/${imageFileName}`)}
                  alt={`Image ${rowIndex * fileNum + colIndex + 1}`}
                  width={325}
                  height={543}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default ImageDisplay;
