// import React, { Component } from 'react';
// import { Image } from 'antd';

// class ImageDisplay extends Component {
//   render() {
//     // Array of image filenames (replace with your image filenames)
//     let fileNum=34

//     const imageFileNames = [];
//     for(let i =1;i<fileNum;i++){
//       imageFileNames.push("image"+i+'.png')
//     }
//     const images = [];
//     while (imageFileNames.length > 0) {
//       images.push(imageFileNames.splice(0, 8));
//     }



//     const containerStyle = {
//       marginTop: '180px', // Adjust the margin as needed
//       marginLeft:"140px",
//       maxHeight:"88%",
//       overflow:"auto"
//     };

//     const imageStyle = {
//       marginRight: '70px', // Adjust the spacing between images as needed
//       marginBottom:"40px"
//     };

//     return (
//       <div className="image-display" style={containerStyle}>
//         {images.map((row, rowIndex) => (
//           <div key={rowIndex} className="image-row" style={{ display: 'flex'}}>
//             {row.map((imageFileName, colIndex) => (
//               <div key={colIndex} className="image-container" style={colIndex < 7 ? {  marginRight: '70px',marginBottom:"40px" } : imageStyle}>
//                 <Image
//                   src={require(`../pictures/${imageFileName}`)}
//                   alt={`Image ${rowIndex * 8 + colIndex + 1}`}
//                   width={325}
//                   height={543}
//                 />
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     );
//   }
// }

// export default ImageDisplay;

import React, { Component } from 'react';
import { Image } from 'antd';
import { connect } from 'react-redux';


class ImageDisplay extends Component {
  render() {
    let modifiedNum = this.props.modifyNumList;  
    // Array of image filenames (replace with your image filenames)
    let fileNum = 34;

    const imagesData = [];
    //记录每张图被修改的次数
    // const modifiedNum = Array(fileNum).fill(0);
    // modifiedNum[0]=2
    // modifiedNum[1]=1

    for (let i = 1; i <= fileNum; i++) {
      const originalImage = `image${i}.png`;
      const modifiedImages = [];
      for(let j=1; j<modifiedNum[i-1]+1;j++){
        modifiedImages.push(`image${i}-${j}.png`);
        console.log("===========",modifiedImages)
      }
      // Add more modified images as needed
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
                  // src={require(`../pictures/${imageFileName}`)}
                  src={`http://localhost:6002/resultImages/${imageFileName}`}
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

// export default ImageDisplay;
const mapStateToProps = state => ({
  modifyNumList: state.modifyNumList
});

export default connect(mapStateToProps)(ImageDisplay);
