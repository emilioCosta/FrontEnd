import { createAction } from '../../redux-creators';
import {
  SET_TRANSCRIPTIONS,
  SET_TIME,
  SET_CURR_TRANS,
  SET_CAPTIONS,
  SET_CURR_CAPTION,
  SET_CURR_EDITING,
  SET_IS_EDITING
} from './trans.action.types';

export const setTranscriptions = createAction(SET_TRANSCRIPTIONS);
export const setTime = createAction(SET_TIME);
export const setCurrTrans = createAction(SET_CURR_TRANS);
export const setCaptions = createAction(SET_CAPTIONS);
export const setCurrCaption = createAction(SET_CURR_CAPTION);
export const setCurrEditing = createAction(SET_CURR_EDITING);
export const setIsEditing = createAction(SET_IS_EDITING);
