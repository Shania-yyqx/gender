// reducers.js
import { SET_IMAGE_NAME, MODIFY_NUM_LIST, RESET_STATE, ADD_COMMENT, UPDATE_CURRENT_IMAGE_ID } from './actions';

const initialState = {
  imageName: '',
//   currentImageIndex: "test", //image index从1开始
  modifyNumList: Array(34).fill(0),
  // 第一列是初始图片的intro
  commentList: [
        ["A beautiful kid"],
        ["A beautiful kid"],
        ["A beautiful kid"],
        ["A beautiful kid"],
        ["A cool kid"],
        ["A cool kid"],
        ["A cool kid"],
        ["A cool kid"],
        ["A kid in a blue room"],
        ["A kid in a blue room"],
        ["A kid in a green room"],
        ["A kid in a green room"],
        ["A kid in a pink room"],
        ["A kid in a pink room"],
        ["An ambitious politician"],
        ["An ambitious politician"],
        ["a photo of a person doing housework"],
        ["Lawyer"],
        ["Lawyer"],
        ["A person with a kind heart"],
        ["A person with a kind heart"],
        ["A person with a kind heart"],
        ["A rich person"],
        ["A rich person"],
        ["A rich person"],
        ["Bad character in the game"],
        ["Bad character in the game"],
        ["Bad character in the game"],
        ["A successful people teaching lesson"],
        ["A successful people teaching lesson"],
        ["A photo of a kid playing dolls"],
        ["A photo of a kid playing dolls"],
        ["A photo of a kid playing robots"],
        ["A photo of a kid playing robots"],
    ],
   currentImageIndex: 1,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IMAGE_NAME:
      return {
        ...state,
        imageName: action.payload
      };
    case MODIFY_NUM_LIST:
      const { index, value } = action.payload;
      return {
        ...state,
        modifyNumList: state.modifyNumList.map((item, idx) => idx === index ? value : item)
      };
    case RESET_STATE:
        // 重置所有的state
        return initialState;
    case ADD_COMMENT:
      const { imgIndex, commentValue } = action.payload;
      return {
        ...state,
        commentList: state.commentList.map((item, idx) => {
          if (idx === imgIndex) {
            return [...item, commentValue]; // 在指定行的末尾添加新元素
          }
          return item;
        })
      };
    case UPDATE_CURRENT_IMAGE_ID:
      return {
        ...state,
        currentImageIndex: action.payload
      };
    default:
      return state;
  }
};

export default rootReducer;
