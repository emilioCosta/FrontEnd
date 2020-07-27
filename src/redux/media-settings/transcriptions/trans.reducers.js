import {
  SET_TRANSCRIPTIONS,
  SET_BEGINTIME
} from './trans.action.types';
import { initialState } from './trans.state';

const transReducer = (state = initialState, action) => {
  const { type, value } = action;

  switch (type) {
    case SET_TRANSCRIPTIONS:
      return { ...state, transcriptions: value };
    case SET_BEGINTIME:
      return { ...state, beginTime: value };

    default:
      return state;
  }
};

export default transReducer;