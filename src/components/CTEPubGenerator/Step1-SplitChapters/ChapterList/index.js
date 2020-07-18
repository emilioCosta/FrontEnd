import React from 'react';
import { CTScrollArea } from 'layout';
import { CTEPubConstants as Constants } from '../../controllers';
import { connectWithRedux } from '../../redux';
import EPubChapterItem from './EPubChapterItem';
import InstructionHeading from './InstructionHeading';
import './index.scss';

function ChapterList({ chapters, /** currChIndex, */ foldedIds }) {
  return (
    <CTScrollArea
      id={Constants.EPubChapterListID}
      className="ct-epb sch-con"
      scrollClassName="ct-epb sch-scroll"
      scrollToTopButton="right"
    >
      <InstructionHeading />

      <div className="ct-d-c ee-sch-chapters">
        {chapters.map((chapter, chapterIndex) => (
          <EPubChapterItem
            key={chapter.id}
            chapter={chapter}
            canDisplayFull
            chapterIndex={chapterIndex}
            canUndoSplit={chapterIndex > 0}
            foldedIds={foldedIds}
          />
        ))}
      </div>
    </CTScrollArea>
  );
}

export default connectWithRedux(
  ChapterList, 
  ['chapters', 'currChIndex', 'foldedIds']
);
