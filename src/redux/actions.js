// actions.js
export const SET_IMAGE_NAME = 'SET_IMAGE_NAME';
export const MODIFY_NUM_LIST = 'MODIFY_NUM_LIST';
export const RESET_STATE = 'RESET_STATE';
export const ADD_COMMENT = 'ADD_COMMENT';
export const UPDATE_CURRENT_IMAGE_ID = 'UPDATE_CURRENT_IMAGE_ID';

export const setImageName = (name) => ({
  type: SET_IMAGE_NAME,
  payload: name
});

export const modifyNumList = (index, value) => ({
    type: MODIFY_NUM_LIST,
    payload: { index, value }
});

export const resetState = () => ({
    type: RESET_STATE,
});

export const addComment = ( imgIndex, commentValue) => ({
    type: ADD_COMMENT,
    payload: { imgIndex, commentValue }
});

export const updateCurrentImageID = (currentImageIndex) => ({
    type: UPDATE_CURRENT_IMAGE_ID,
    payload: currentImageIndex
});