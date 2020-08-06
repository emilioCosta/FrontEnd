import React, { useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { util, api, timestr } from 'utils';


import {
  transControl,
  videoControl,
  timeStrToSec,
  prettierTimeStr,
  // WEBVTT_DESCRIPTIONS,
} from '../../../../Watch/Utils';
import './index.css';

function CaptionLine({ isCurrent = false, isEditing = false, shouldHide = false, caption = {} }) {
  const { text = '', id, begin, kind } = caption;
  const ref = useRef();

  const blurFromInput = () => {
    if (ref && ref.current && typeof ref.current.blur === 'function') {
      if (document.activeElement.id === ref.current.id) {
        ref.current.blur();
      }
    }
  };

  const handleChange = ({ target }) => {
    // console.log(target.innerText)
    transControl.handleChange(target.innerText);
    // console.log(target.value)
  };

  const handleFocus = ({ target }) => {
    // console.error(target.innerText)
    transControl.edit(caption, target.innerText);
  };

  const handleBlur = () => {
    transControl.handleBlur();
  };

  const handleSave = (target) => {
    // transControl.handleSaveEditing(cap);
    let innerText = target.innerText;
    if(innerText === null) innerText = text;
    api.updateCaptionLine({ id, innerText });
    // console.log("HAS BEEN SAVED!!!!!!!!!!!!!!!!");
  };

  // const handleCancel = () => {
  //   ref.current.innerHTML = text;
  //   transControl.handleCancelEditing();
  // };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      handleSave();
      blurFromInput();
    }
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
          onFocus={handleFocus}
          onBlur={handleBlur}
          onInput={handleChange}
          onKeyDown={handleKeyDown}
          spellCheck={false}
        />
        <button
          className="caption-cc-line-btns plain-btn caption-line-save-btn"
          onClick={handleSave}
          tabIndex={-1}
          aria-hidden
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default CaptionLine;
