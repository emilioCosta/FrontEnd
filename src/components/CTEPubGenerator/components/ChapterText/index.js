import React, { useState, useEffect } from 'react';
import { Popup } from 'semantic-ui-react';
import { elem } from 'utils/use-elem';
import { MDPreviewer, MDEditor } from '../Markdown';
import './index.scss';

export function ChapterText({
  text = '',
  id = '',
  chapter,
  onSaveText,
  screenshots,
  chapterScreenshots
}) {
  const [editing, setEditing] = useState(false);

  const startEditing = () => setEditing(true);
  const closeEditing = () => setEditing(false);

  const handleKeyDown = ({ keyCode }) => {
    if (keyCode === 13 || keyCode === 32) {
      startEditing();
    }
  };

  const onSave = (newText) => {
    if (typeof onSaveText === 'function') {
      onSaveText(newText);
    }
    closeEditing();
  };

  const { image } = chapter;

  const isNotEmpty = Boolean(text.trim());

  useEffect(() => {
    if (editing) {
      setEditing(false);
    }
  }, [chapter]);

  useEffect(() => {
    if (editing) {
      elem.scrollIntoCenter(id);
    }
  }, [editing]);

  return (
    <div id={id} className="ct-epb ch-text-con">
      {editing ? (
        <div className="w-100 mb-4">
          <MDEditor
            height="300px"
            id={`md-editor-${id}`}
            defaultValue={text}
            onSave={onSave}
            onClose={closeEditing}
            screenshots={screenshots}
            chapterScreenshots={chapterScreenshots}
            defaultImage={image}
          />
        </div>
      ) : (
        <Popup
          inverted
          basic
          openOnTriggerFocus
          openOnTriggerClick={false}
          openOnTriggerMouseEnter
          closeOnTriggerMouseLeave
          closeOnTriggerBlur
          content="Click to edit"
          position="top center"
          disabled={!isNotEmpty}
          trigger={
            <div
              className="ct-epb ch-text clickable"
              tabIndex={0}
              role="button"
              onClick={startEditing}
              onKeyDown={handleKeyDown}
            >
              {isNotEmpty ? (
                <MDPreviewer value={text} />
              ) : (
                <div className="text-muted">Click to add content</div>
              )}
            </div>
          }
        />
      )}
    </div>
  );
}
