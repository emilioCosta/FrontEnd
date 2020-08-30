import { ARRAY_INIT } from 'utils';

export const initialState = {
  transcriptions: ARRAY_INIT,
  time: 0,
  currTrans: {},
  captions: [],
  currCaption: null,
  currEditing: -1,
  isEditing: false
};