import React from 'react';
import { CTFragment } from 'layout';
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
  setTranscriptions,
  setTime,
  setCurrTrans,
  setCaptions,
  setCurrCaption,
  setCurrEditing
}) {
  // states & dispatches
  const props = {
    transcriptions,
    time,
    currTrans,
    captions,
    currCaption,
    currEditing
  }
  const dispatches = {
    setTranscriptions,
    setTime,
    setCurrTrans,
    setCaptions,
    setCurrCaption,
    setCurrEditing
  }
  return (

    <CTFragment fade className="msp-tab-con">
      <Player />
      <TransTable media={media} props={props} dispatches={dispatches} />
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
    'currEditing'
  ],
  [
    'setTranscriptions',
    'setTime',
    'setCurrTrans',
    'setCaptions',
    'setCurrCaption',
    'setCurrEditing'
  ],
  ['media'],
);
