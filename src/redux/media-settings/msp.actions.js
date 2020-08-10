import { createAction } from '../redux-creators';
import { 
    SET_TRANSCRIPTIONS,
    SET_BEGINTIME,
    SET_CURR_TRANS,
    SET_CAPTIONS,
    SET_TRANSCRIPT,
    SET_CURR_CAPTION,
    SET_DESCRIPTION,
    SET_CURR_DESCRIPTION,
    SET_CURR_EDITING,
    SET_BULK_EDITING,SET_MEDIA, SET_PLAYLIST, SET_ERROR } from './msp.action.types';

export const setMedia = createAction(SET_MEDIA);
export const setPlaylist = createAction(SET_PLAYLIST);

export const setTranscriptions = createAction(SET_TRANSCRIPTIONS);
export const setBeginTime = createAction(SET_BEGINTIME);
export const setCurrTrans = createAction(SET_CURR_TRANS);
export const setTranscript = createAction(SET_TRANSCRIPT);
export const setCaptions = createAction(SET_CAPTIONS);
export const setCurrCaption = createAction(SET_CURR_CAPTION);
export const setDescriptions = createAction(SET_DESCRIPTION);
export const setCurrDescription = createAction(SET_CURR_DESCRIPTION);
export const setCurrEditing = createAction(SET_CURR_EDITING);
export const setBulkEditing = createAction(SET_BULK_EDITING);

export const setError = createAction(SET_ERROR);
