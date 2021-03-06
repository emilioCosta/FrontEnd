import React from 'react';
import CTFragment from '../CTFragment';

/**
 * A general footer for ClassTranscribe
 */
function CTFooter() {
  return (
    <CTFragment padding={[50, 20]} list vCenter as="footer" id="ct-footer">
      <span>ClassTranscribe source code &copy; 2016-2020 University of Illinois.</span>
      <span>
        Media, including video content, are copyrighted under their current copyright owner.
      </span>
    </CTFragment>
  );
}

export default CTFooter;

