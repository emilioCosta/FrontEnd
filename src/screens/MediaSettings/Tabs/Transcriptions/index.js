import React from 'react';
import { CTFragment } from 'layout';
import { connectWithRedux } from '../../controllers/trans';
import Player from './Player';
import TransTable from './TransTable';

export function TranscriptionsWithRedux({
  media,
  time
}) {
  return (
    // height width 100% 
    // flex
    <CTFragment fade className="msp-tab-con">
      <Player />
      <TransTable media={media} time={time} />
    </CTFragment>
  );
}

export const Transcriptions = connectWithRedux(
  TranscriptionsWithRedux,
  ['time',
    'transcriptions',
    'currTrans',
    'captions',
    'currCaption',
    'currEditing'],
  [],
  ['media'],
);
