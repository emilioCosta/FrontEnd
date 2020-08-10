import { ARRAY_INIT } from 'utils';

export const initialState = {
  transcriptions: ARRAY_INIT,
  beginTime: 0,
  currTrans: {},
  transcript: [],
  captions: [],
  currCaption: null,
  descriptions: [],
  currDescription: null,
  currEditing: null,
  bulkEditing: false,
};