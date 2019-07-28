import React from 'react'
import { IconButton } from '@material-ui/core'

export default function Captions({ captions }) {
  return (
    <div className="captions">
      {captions.map( line => (
        <CaptionLine line={line} key={line.id} />
      ))}
    </div>
  )
}

function CaptionLine({ line }) {
  const { text, index, id } = line
  return (
    <div className="line" id={`line-${index}`} >
      <div className="likes">
        <IconButton className="icon">
          <i className="material-icons">thumb_down</i>
        </IconButton>&ensp;
        <span className="num">20</span>
        <IconButton className="icon">
          <i className="material-icons">thumb_up</i>
        </IconButton>&ensp;
        <span className="num">31</span>
      </div>

      <div className="text">
        {text}&ensp;<i className="material-icons">edit</i>
      </div>

      <div className="edit">
        <IconButton className="icon">
          <i className="material-icons">edit</i>
        </IconButton> <span className="name">Edit</span>
        <IconButton className="icon">
          <i className="material-icons">share</i>
        </IconButton> <span className="name">Share</span>
      </div>
    </div>
  )
}