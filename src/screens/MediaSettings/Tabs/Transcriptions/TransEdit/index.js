import React, { useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { util, api, timestr } from 'utils';

import {
  CTInput
} from 'layout';
import {
  transControl,
  videoControl,
  timeStrToSec,
  prettierTimeStr,
} from '../../../../Watch/Utils';
import { connectWithRedux } from '../../../controllers/trans';
import './index.scss';


function TransEdit({
  isCurrent = false,
  isEditing = false,
  shouldHide = false,
  caption = {},
  captions,
  currCaption,
  currEditing
}) {
  const { text = '', id, begin, kind } = caption;
  const ref = useRef();

  // const blurFromInput = () => {
  //   if (ref && ref.current && typeof ref.current.blur === 'function') {
  //     if (document.activeElement.id === ref.current.id) {
  //       ref.current.blur();
  //     }
  //   }
  // };

  const handleChange = ({ target }) => {
    // console.log(target.innerText)
    transControl.handleChange(target.innerText);
  };

  const handleBlur = () => {
    transControl.handleBlur();
  };

  const handleSave = (cap) => {
    transControl.handleSaveEditing(cap);
    // let innerText = evt.target.innerText;
    // console.log(editText);
    // api.updateCaptionLine({ id, editText });
  };

  const timeStr = prettierTimeStr(begin);
  const hasUnsavedChanges = ref && ref.current && ref.current.innerText !== text;

  return (
    <div
      id={`caption-line-${id}`}
      className="cc-caption-line"
      current={isCurrent.toString()}
      editing={isEditing.toString()}
      hide={shouldHide.toString()}
      kind={kind}
      data-unsaved={hasUnsavedChanges}
    >
      <div className="caption-line-content">

        {/* Caption Line */}
        <div
          ref={ref}
          contentEditable={!isMobile}
          id={`cc-line-textarea-${id}`}
          className="cc-line-text"
          dangerouslySetInnerHTML={{ __html: text }}
          onBlur={handleBlur}
          onInput={handleChange}
          // onKeyDown={handleKeyDown}
          spellCheck={false}
        />
        {/* <button
          className="caption-cc-line-btns plain-btn caption-line-save-btn"
          onClick={handleSave}
          tabIndex={-1}
          aria-hidden
        >
          Save
        </button> */}
      </div>
    </div>
  );
}

export default connectWithRedux(
  TransEdit,
  [
    'captions',
    'currCaption',
    'currEditing',
  ],
  [
    // 'setTranscriptions',
    // 'setTime',
    // 'setCurrTrans',
    'setCaptions',
    'setCurrCaption',
    'setCurrEditing'
  ],
  [],
  []
);