import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import _ from 'lodash';
import { util, api, timestr } from 'utils';
import {
  CTFragment, CTInput
} from 'layout';
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import {
  AutoSizer,
  Column,
  Table,
  defaultTableRowRenderer,
  CellMeasurer,
  CellMeasurerCache,
} from 'react-virtualized';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { connectWithRedux } from '../../../controllers/trans';
import 'react-virtualized/styles.css'
import TransEdit from '../TransEdit';

function TransTable(
  { media, states, dispatches }
) {
  const {
    transcriptions,
    // time,
    currTrans,
    captions,
    currCaption,
    currEditing,
    isEditing
  } = states;
  const {
    setTranscriptions,
    setTime,
    setCurrTrans,
    setCaptions,
    setCurrCaption,
    setCurrEditing,
    setIsEditing
  } = dispatches;
  const [language, setLanguage] = useState('en-US')
  const data_rows = []
  const [open, setOpen] = useState(false)

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [captionIndex, setCaptionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const onRowClick = () => setOpen(!open);

  const handleCaptionChange =
    ({ target: { value } }) => setCurrCaption(value);

  const tableRef = useRef();

  const createData = (id, time, text, operations = undefined) => {
    return { id, time, text, operations }
  }

  // useEffect(() => {
  //   console.log(captions, transcriptions)
  // }, [captions, transcriptions])

  // set transcriptions and captions
  useEffect(() => {
    if (!media.isUnavailable) {
      setTranscriptions(media.transcriptions)
      _.map(media.transcriptions, (val) => {
        if (val.language === language) {
          api.getCaptionsByTranscriptionId(val.id).then((res) => {
            if (res && res.status === 200) {
              // res.data is the captions array
              setCaptions(res.data)
            }
          })
        }
      })
    }
  }, [media])

  useEffect(
    () => {
      tableRef.current.recomputeRowHeights();
      // get the begin time of selected caption
      _.map(captions, (val) => {
        if (val.index === selectedIndex + 1) {
          // console.log(selectedIndex,
          //   val.begin,
          //   timestr.toSeconds(val.begin))
        }
      })
    }
    , [selectedIndex]
  );

  // const handleSeek = () => {
  //   const time = timeStrToSec(begin);
  //   videoControl.currTime(time);
  // };

  for (let i = 0; i < captions.length; i += 1) {
    data_rows.push(createData(i,
      <>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={0}
        >
          <button
            className="plain-btn caption-line-time-display msp-caption-time-begin"
          // onClick={handleSeek}
          >
            <span tabIndex="-1">{captions[i].begin.split('.')[0]}</span>
          </button>
          <button
            className="plain-btn caption-line-time-display msp-caption-time-begin"
          // onClick={handleSeek}
          >
            <span tabIndex="-1">{captions[i].end.split('.')[0]}</span>
          </button>
        </Grid>
      </>,
      // <CTInput
      //   className="msp-caption-input"
      //   underlined
      //   textarea
      //   value={captions[i].text}
      // />
      <TransEdit
        key={captions[i].id}
        caption={captions[i]}
      // isEditing={Boolean(currEditing) && currEditing.id === caption.id}
      // currCaption={currCaption}
      // isCurrent={isCurrent(caption.id)}
      />
      ,
      // <Button id="delete-button">
      //   <i className="material-icons" id="delete-icon">delete</i>
      //   Delete
      // </Button>
    ));
  }

  const rowRenderer = props => {
    const { index, style, className, key, rowData } = props;
    // console.log(className)
    return defaultTableRowRenderer(
      {
        ...props,
        // style: { ...style, backgroundColor: 'red' }
      }
    )
  };

  const headerRenderer = ({ label, columnIndex }) => {
    if (!columnIndex) {
      return (
        // <TableCell
        //   component="div"
        //   variant="head"
        //   align="right"
        //   id="header"
        // >
        //   <span>
        //     {label}
        //   </span>
        // </TableCell>
        <div>
          <Button className="header-button" startIcon={<SaveIcon />}>Save</Button>
          <Button className="header-button" startIcon={<CancelIcon />}>Cancel</Button>
        </div>

      )
    }
  };


  const cellRenderer = ({ cellData, columnIndex, rowIndex, parent, key, style }) => {
    if (cellData !== undefined) {
      return (
        <TableCell
          component="div"
          id={`cell-${columnIndex}`}
          variant="body"
          align="right"
          style={{
            ...style,
            borderBottom: 0
          }}
        >
          {cellData}
        </TableCell>
      );
    }
  };

  const getRowHeight = ({ index }) => (index === selectedIndex ? 90 : 48);

  return (
    <CTFragment id="msp-t-table-con" data-scroll>
      <AutoSizer>
        {({ height, width }) => (
          <Table
            ref={tableRef}
            height={height}
            width={width}
            headerHeight={48}
            rowHeight={68}
            rowGetter={({ index }) => data_rows[index]}
            rowCount={data_rows.length}
            // scrollToIndex={captionIndex}
            rowRenderer={
              //   (props) => rowRenderer({
              //   ...props,
              //   onRowClick: () => {
              //     onRowClick()
              //     if (selectedIndex === props.index) {
              //       setSelectedIndex(-1)
              //     } else {
              //       setSelectedIndex(props.index)
              //     }
              //   },
              // })
              rowRenderer
            }
          >
            <Column
              headerRenderer={() =>
                headerRenderer({
                  label: 'Time',
                  columnIndex: 0,
                })}
              dataKey="time"
              cellRenderer={cellRenderer}
              width={200}
            />
            <Column
              headerRenderer={() =>
                headerRenderer({
                  label: 'Caption',
                  columnIndex: 1,
                })}
              dataKey="text"
              cellRenderer={cellRenderer}
              width={500}
            />

          </Table>
        )}
      </AutoSizer>
    </CTFragment>
  );
}

export default connectWithRedux(
  TransTable,
  [
    // 'transcriptions',
    // 'time',
    // 'currEditing',
  ],
  [
    // 'setTranscriptions',
    // 'setTime',
    // 'setCurrTrans',
    // 'setCaptions',
    // 'setCurrCaption',
    // 'setCurrEditing'
  ],
  ['media'],
  []
);
