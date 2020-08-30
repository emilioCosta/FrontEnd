import React from 'react';
import { CTFragment } from 'layout';
import CTPlayer from 'components/CTPlayer';
import { connectWithRedux } from '../../../controllers/trans';
import './index.scss';

function Player({
  media,
  time,
}) {
  return (
    <CTFragment id="msp-t-player-con" list data-scroll>
      <CTPlayer
        id="msp-t-player"
        media={media}
        width={540}
        allowTwoScreen
        hideWrapperOnMouseLeave
        defaultOpenRangePicker
        defaultOpenCC
        allowRangePicker
        defaultRange={[200, 400]}
      />
    </CTFragment>
  );
}

export default connectWithRedux(
  Player,
  ['time'],
  [],
  ['media']
);
