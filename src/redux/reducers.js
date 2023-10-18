// reducers.js
import { SET_IMAGE_NAME, MODIFY_NUM_LIST } from './actions';

const initialState = {
  imageName: '',
  modifyNumList: Array(34).fill(0)
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
    default:
      return state;
  }
};

export default rootReducer;