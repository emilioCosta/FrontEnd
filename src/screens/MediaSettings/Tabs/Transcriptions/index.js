import React from 'react';
import { CTFragment, CTText } from 'layout';
import { connectWithRedux } from '../../controllers/trans';
import Player from './Player';
import TransTable from './TransTable';

export function TranscriptionsWithRedux({
  media,
}) {
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
  [],
  [],
  ['media']
);
