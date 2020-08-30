import React from 'react';
import { CTFragment, CTText } from 'layout';
import { connectWithRedux } from '../../controllers/trans';
import Player from './Player';
import TransTable from './TransTable';

export function TranscriptionsWithRedux({
  media,
  transcriptions,
  time,
  currTrans,
  captions,
  currCaption,
  currEditing,
  isEditing,
  setTranscriptions,
  setTime,
  setCurrTrans,
  setCaptions,
  setCurrCaption,
  setCurrEditing,
  setIsEditing
}) {
  // states & dispatches
  const states = {
    transcriptions,
    time,
    currTrans,
    captions,
    currCaption,
    currEditing,
    isEditing,
  }
  const dispatches = {
    setTranscriptions,
    setTime,
    setCurrTrans,
    setCaptions,
    setCurrCaption,
    setCurrEditing,
    setIsEditing
  }
  return (

    <CTFragment fade className="msp-tab-con">
      {/* <Player />
      <TransTable media={media} /> */}
      <CTFragment center padding={[30, 0]}>
        <CTText celadon size="medium">
          In progress
        </CTText>
      </CTFragment>
    </CTFragment>
  );
}

export const Transcriptions = connectWithRedux(
  TranscriptionsWithRedux,
  [
    'transcriptions',
    'time',
    'currTrans',
    'captions',
    'currCaption',
    'currEditing',
    'isEditing'
  ],
  [
    'setTranscriptions',
    'setTime',
    'setCurrTrans',
    'setCaptions',
    'setCurrCaption',
    'setCurrEditing',
    'setIsEditing'
  ],
  ['media'],
);
