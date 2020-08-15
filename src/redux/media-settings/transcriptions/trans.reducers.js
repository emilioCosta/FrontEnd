import {
  SET_TRANSCRIPTIONS,
  SET_TIME,
  SET_CURR_TRANS,
  SET_CAPTIONS,
  SET_CURR_CAPTION,
  SET_CURR_EDITING,
  SET_IS_EDITING
} from './trans.action.types';
import { initialState } from './trans.state';

const transReducer = (state = initialState, action) => {
  const { type, value } = action;

  switch (type) {
    case SET_TRANSCRIPTIONS:
      return { ...state, transcriptions: value };
    case SET_TIME:
      return { ...state, time: value };
    case SET_CURR_TRANS:
      return { ...state, currTrans: value };
    case SET_CAPTIONS:
      return { ...state, captions: value };
    case SET_CURR_CAPTION:
      return { ...state, currCaption: value };
    case SET_CURR_EDITING:
      return { ...state, currEditing: value };
    case SET_IS_EDITING:
      return { ...state, isEditing: value };
    default:
      return state;
  }
};

export default transReducer;