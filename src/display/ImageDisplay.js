import React, { Component } from 'react';
import { connect } from 'react-redux';
import './imageDisplay.css';

class ImageDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImageIndex: -1,
      comment:" "
    };
  }

  render() {
    let comments = new Array(34);
    comments[0] = ['nice try', 'this is sooo interesting，this is sooo interesting，this is sooo interesting'];
    comments[2] = ['good choice'];

    let modifiedNum = this.props.modifyNumList;
    let fileNum = 34;

    const imagesData = [];

    for (let i = 1; i <= fileNum; i++) {
      const originalImage = `image${i}.png`;
      const modifiedImages = [];
      for (let j = 1; j < modifiedNum[i - 1] + 1; j++) {
        modifiedImages.push(`image${i}-${j}.png`);
      }
      imagesData.push([originalImage, ...modifiedImages]);
    }

    const containerStyle = {
      marginTop: '180px',
      marginLeft: '140px',
      maxHeight: '88%',
      overflow: 'auto',
    };

    const imageStyle = {
      marginRight: '70px',
      marginBottom: '40px',
    };

    const showComments = (fileName,rowIndex,colIndex) => {
      this.setState({ selectedImageIndex: fileName });
      this.setState({comment:comments[rowIndex][colIndex] })
      console.log("这里rowIndex,colIndex， filename",fileName,rowIndex,colIndex)
    };

    const hideComments = () => {
      this.setState({ selectedImageIndex: -1 });
    };


    return (
      <div className="image-display" style={containerStyle}>
        {imagesData.map((imageRow, rowIndex) => (
          <div key={rowIndex} className="image-row" style={{ display: 'flex' }}>
            {imageRow.map((imageFileName, colIndex) => (
              <div key={colIndex} className="image-container" style={imageStyle}>
                <img
                  src={`http://localhost:6002/resultImages/${imageFileName}`}
                  alt={`Image ${rowIndex * fileNum + colIndex + 1}`}
                  width={325}
                  height={543}
                  onClick={() => showComments(imageFileName, rowIndex, colIndex)}
                />
              </div>
            ))}
          </div>
        ))}
        {this.state.selectedImageIndex !== -1 && (
          <div className="overlay1" onClick={hideComments}>
            <div className="image-popup">
              <img
                src={`http://localhost:6002/resultImages/${this.state.selectedImageIndex}`}
                alt="Popup Image"
                width={ 780}
                height={ 1303}
              />
              <div className="comment">{this.state.comment}</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  modifyNumList: state.modifyNumList,
});

export default connect(mapStateToProps)(ImageDisplay);