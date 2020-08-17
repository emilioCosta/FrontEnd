import React, { useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { util, api, timestr } from 'utils';
import {
  CTInput
} from 'layout';
import TextField from '@material-ui/core/TextField';
import {
  transControl,
  videoControl,
  timeStrToSec,
  prettierTimeStr,
} from '../../../../Watch/Utils';
import { connectWithRedux } from '../../../controllers/trans';

import styles from './index.scss';


export default ({
  caption = {},
  captions = [],
  index = 0,
}) => {
  const { text = '', id, } = caption;
//   const ref = useRef();

  const handleChange = () => {
    // captions[index] = 
    
  }
  return (
    <div className="caption-line-content">
      <CTInput
        //   ref={ref}
        id={`cc-line-textarea-${id}`}
        className={styles.cc_line_text}
        underlined
        defaultValue={text}
        onChange={handleChange}
      />
    </div>
  );
}