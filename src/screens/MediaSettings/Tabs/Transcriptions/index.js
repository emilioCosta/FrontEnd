import React from 'react';
import { CTFragment } from 'layout';
import { connectWithRedux } from '../../controllers/trans';
import Player from './Player';
import TransTable from './TransTable';

export function TranscriptionsWithRedux({
  media,
  beginTime
}) {
  return (
    <CTFragment fade className="msp-tab-con">
      <Player beginTime={beginTime} />
      <TransTable media={media} />
    </CTFragment>
  );
}

export const Transcriptions = connectWithRedux(
  TranscriptionsWithRedux,
  [],
  ['beginTime'],
  ['media']
);
