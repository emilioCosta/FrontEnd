import React from 'react';
import { CTFragment } from 'layout';
import { connectWithRedux } from '../../controllers/trans';
import Player from './Player';
import TransTable from './TransTable';

export function TranscriptionsWithRedux({
  media,
  // beginTime
    // currCaption,
    // mode,
    // transView = LINE_VIEW,
    // currEditing = null,
    // search = SEARCH_INIT,
}) {
  return (
    // height width 100% 
    // flex
    <CTFragment fade className="msp-tab-con">
      <Player />
      <TransTable media={media} />
    </CTFragment>
  );
}

export const Transcriptions = connectWithRedux(
  TranscriptionsWithRedux,
  [],
  [],
  ['media'],
);
