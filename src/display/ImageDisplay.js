import React, { Component } from 'react';
import { Image } from 'antd';

class ImageDisplay extends Component {
  render() {
    // Array of image filenames (replace with your image filenames)
    let fileNum=34

    // const fs = require('fs');
    // const path = require('path');

    // const imageContext = require.context('../pictures', false, /\.(jpg|jpeg|png|gif|bmp|webp)$/);

    // const imageFileNames = imageContext.keys().map(imageContext);


    const imageFileNames = [];
    for(let i =1;i<fileNum;i++){
      imageFileNames.push("image"+i+'.png')
    }
    const images = [];
    while (imageFileNames.length > 0) {
      images.push(imageFileNames.splice(0, 8));
    }



    const containerStyle = {
      marginTop: '180px', // Adjust the margin as needed
      marginLeft:"140px",
      maxHeight:"88%",
      overflow:"auto"
    };

    const imageStyle = {
      marginRight: '70px', // Adjust the spacing between images as needed
      marginBottom:"40px"
    };

    return (
      <div className="image-display" style={containerStyle}>
        {images.map((row, rowIndex) => (
          <div key={rowIndex} className="image-row" style={{ display: 'flex'}}>
            {row.map((imageFileName, colIndex) => (
              <div key={colIndex} className="image-container" style={colIndex < 7 ? {  marginRight: '70px',marginBottom:"40px" } : imageStyle}>
                <Image
                  src={require(`../pictures/${imageFileName}`)}
                  alt={`Image ${rowIndex * 8 + colIndex + 1}`}
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
