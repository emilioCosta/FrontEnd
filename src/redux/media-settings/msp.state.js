import { api } from 'utils/cthttp';

export const initialState = {
    media: api.parseMedia(),
    playlist: {},
    transcriptions: [],
    beginTime: 0,
    currTrans: {},
    transcript: [],
    captions: [],
    currCaption: null,
    descriptions: [],
    currDescription: null,
    currEditing: null,
    bulkEditing: false,
    error: null
};