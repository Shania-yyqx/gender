import React, { Component } from 'react';
import { Image } from 'antd';
import { connect } from 'react-redux';
import { updateCurrentImageID } from '../redux/actions';  // 根据实际路径更新
import { withRouter } from 'react-router-dom';


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
                  // src={require(`../pictures/${imageFileName}`)}
                  src={`http://localhost:6002/resultImages/${imageFileName}`}
                  alt={`Image ${rowIndex * fileNum + colIndex + 1}`}
                  width={325}
                  height={543}
                  onClick={() => {
                    console.log("ImageDisplay commentList:", this.props.commentList[rowIndex][colIndex])
                  }}  
                  onDoubleClick={() => {
                    console.log("ImageDisplay rowIndex:", rowIndex)
                    // 双击后edit这张图片
                    this.props.updateCurrentImageID(rowIndex+1);
                    this.props.history.push("/")
                  }}
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
  modifyNumList: state.modifyNumList,
  commentList: state.commentList,
});
const mapDispatchToProps = dispatch => ({
  updateCurrentImageID: (currentImgIndex) => dispatch(updateCurrentImageID(currentImgIndex)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ImageDisplay));
