// actions.js
export const SET_IMAGE_NAME = 'SET_IMAGE_NAME';
export const MODIFY_NUM_LIST = 'MODIFY_NUM_LIST';
export const RESET_STATE = 'RESET_STATE';

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
