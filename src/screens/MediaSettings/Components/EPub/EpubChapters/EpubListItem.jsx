import React from 'react';
import { api } from 'utils';
import { Button } from 'pico-ui';
import { epub } from 'screens/MediaSettings/Utils';

const classNames = require('classnames');

export default function EpubListItem({
  item,
  itemIndex,
  chapterIndex,
  subChapterIndex,
  isSubChapter=false,
  canSplit=false,
  canSplitSubChapter=false,
  canSubdivide=false,
}) {

  let itemClass = classNames('ee-el-item ct-d-c', {
    'padded': !canSplit && !isSubChapter
  })

  return (
    <div className={itemClass}>
      <div className="ee-el-i-actions">
        {
          canSplit
          &&
          <Button uppercase round
            classNames="ee-el-i-split-btn"
            text="Split Chapter"
            color="blue transparent"
            icon="unfold_more"
            onClick={
              () => isSubChapter
              ? epub.splitChapterFromSubChaptersItems(chapterIndex, subChapterIndex, itemIndex)
              : epub.splitChapterFromChaptersItems(chapterIndex, itemIndex)
            }
          />
        }

        {
          canSplitSubChapter
          &&
          <Button uppercase round
            classNames="ee-el-i-split-btn"
            text="New Sub-Chapter"
            color="blue transparent"
            icon="subdirectory_arrow_right"
            onClick={() => epub.splitSubChapter(chapterIndex, subChapterIndex, itemIndex)}
          />
        }

        {
          canSubdivide
          &&
          <Button uppercase round
            classNames="ee-el-i-sub-ch-btn"
            text="subdivide"
            color="blue transparent"
            icon="subdirectory_arrow_right"
            onClick={() => epub.subdivideChapter(chapterIndex, itemIndex)}
          />
        }
      </div>

      <div className="ct-d-r ee-el-i-info">
        <div 
          className="ee-el-i-img"
          tabIndex="0"
          onMouseEnter={() => epub.magnifyImage(api.getMediaFullPath(item.image))}
          onMouseLeave={() => epub.endMagnifyImage()}
          onFocus={() => epub.magnifyImage(api.getMediaFullPath(item.image))}
          onBlur={() => epub.endMagnifyImage()}
        >
          <img src={api.getMediaFullPath(item.image)} alt="screenshot" />
        </div>
        <div className="ee-el-i-text">
          {
            item.text 
            ||
            <span className="text-muted"><i>No Transcriptions</i></span>
          }
        </div>
      </div>
    </div>
  );
}
