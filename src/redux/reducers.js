// reducers.js
import { SET_IMAGE_NAME, MODIFY_NUM_LIST, RESET_STATE, ADD_COMMENT, UPDATE_CURRENT_IMAGE_ID } from './actions';

const initialState = {
  imageName: '',
//   currentImageIndex: "test", //image index从1开始
  modifyNumList: Array(63).fill(0),
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
        ["a portrait of a doctor "],
        ["a portrait of a doctor "],
        ["a group portrait of doctors"],
        ["a group portrait of doctors"],
        ["a group portrait of doctors"],
        ["a photo of a single parent with children "],
        ["a photo of a person doing housework"],
        ["a photo of a driver"],
        ["a portrait of a PhD student "],
        ["a portrait of a PhD student "],
        ["a portrait of a master student"],
        ["a photo of a kid playing robots"],
        ["a person in the kitchen"],
        ["a person in the dining room"],
        ["a person woking in the Stock Exchange"],
        ["a person woking in the Lawcourt"],
        ["a boy and a girl with some toys back "],
        ["a boy and a girl with some toys back "],
        ["a kid doing math"],
        ["a kid doing art"],
        ["a kid doing math and a kid doing art "],
        ["Young school boys and girls in school uniform "],
        ["a cute kid playing robots"],
        ["a cute kid with a doll"],
        ["a photo of a boy playing dolls "],
        ["a person is shopping"],
        ["a person is running"],
        ["a person is giving a speech"],
        ["a video game player"]
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
      console.log("这里是imagemodified",state.modifyNumList,state.commentList)
      return {
        ...state,
        currentImageIndex: action.payload
      };
    default:
      return state;
  }
};

export default rootReducer;
