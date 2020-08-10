import { initialState } from './msp.state';
import { 
  SET_TRANSCRIPTIONS,
  SET_BEGINTIME,
  SET_CURR_TRANS,
  SET_TRANSCRIPT,
  SET_CAPTIONS,
  SET_CURR_CAPTION,
  SET_DESCRIPTION,
  SET_CURR_DESCRIPTION,
  SET_CURR_EDITING,
  SET_BULK_EDITING,
  SET_MEDIA, SET_ERROR, SET_PLAYLIST } from './msp.action.types';

const mspReducer = (state = initialState, action) => {
  const { type, value } = action;

  switch (type) {
    case SET_MEDIA:
      return { ...state, media: value };
    case SET_PLAYLIST:
      return { ...state, playlist: value };
    case SET_TRANSCRIPTIONS:
      return { ...state, transcriptions: value };
    case SET_BEGINTIME:
      return { ...state, beginTime: value };
    case SET_CURR_TRANS:
      return { ...state, currTrans: value };
    case SET_TRANSCRIPT:
      return { ...state, transcript: value };
    case SET_CAPTIONS:
      return { ...state, captions: value };
    case SET_CURR_CAPTION:
      return { ...state, currCaption: value };
    case SET_DESCRIPTION:
      return { ...state, descriptions: value };
    case SET_CURR_DESCRIPTION:
      return { ...state, currDescription: value };
    case SET_CURR_EDITING:
      return { ...state, currEditing: value };
    case SET_BULK_EDITING:
      return { ...state, bulkEditing: value };
    case SET_ERROR:
      return { ...state, error: value };
    default:
      return state;
  }
};

export default mspReducer;
