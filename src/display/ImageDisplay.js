import React, { Component } from 'react';

class ImageDisplay extends Component {
  render() {
    // Array of image filenames (replace with your image filenames)
    const imageFileNames = [
      'image1.png',
      'image2.png',
      'image3.png',
      'image4.png',
      'image5.png',
      'image6.png',
      'image7.png',
      'image8.png',
      'image9.png',
      'image10.png',
      // Add more image filenames here
    ];

    const images = [];
    while (imageFileNames.length > 0) {
      images.push(imageFileNames.splice(0, 8));
    }

    const containerStyle = {
      marginTop: '180px', // Adjust the margin as needed
      marginLeft:"140px",
      maxHeight:"100%",
      overflow:"auto"
    };

    const imageStyle = {
      marginRight: '70px', // Adjust the spacing between images as needed
      marginBottom:"40px"
    };

    return (
      <div className="image-display" style={containerStyle}>
        {images.map((row, rowIndex) => (
          <div key={rowIndex} className="image-row" style={{ display: 'flex' }}>
            {row.map((imageFileName, colIndex) => (
              <div key={colIndex} className="image-container" style={colIndex < 7 ? {  marginRight: '70px',marginBottom:"40px" } : imageStyle}>
                <img
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
