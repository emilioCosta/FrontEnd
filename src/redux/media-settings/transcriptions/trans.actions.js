import { createAction } from '../../redux-creators';
import {
  SET_TRANSCRIPTIONS,
  SET_BEGINTIME
} from './trans.action.types';

export const setTranscriptions = createAction(SET_TRANSCRIPTIONS);
export const setBeginTime = createAction(SET_BEGINTIME);