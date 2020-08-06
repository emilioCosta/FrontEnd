import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import _ from 'lodash';
import { util, api, timestr } from 'utils';
import { CTFragment } from 'layout';
import { withStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import { CTPlayerController } from 'components/CTPlayer/controllers'
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import {
  AutoSizer,
  Column,
  Table,
  defaultTableRowRenderer,
  CellMeasurer,
  CellMeasurerCache,
} from 'react-virtualized';
import Paper from '@material-ui/core/Paper';
import { connectWithRedux } from '../../../controllers/trans';
import 'react-virtualized/styles.css'
import CaptionLine from '../CaptionLine';

function TransTable(
  media = undefined
  // currCaption = {},
  // mode = NORMAL_MODE,
  // transView = LINE_VIEW,
  // currEditing = null,
  // search = SEARCH_INIT,
){
  const [language, setLanguage] = useState('en-US')
  const [transcript, setCaptions] = useState([])
  const data_rows = []
  const [open, setOpen] = useState(false)

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [captionIndex, setCaptionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const onRowClick = () => setOpen(!open);

  const tableRef = useRef();

  const createData = (id, startTime, text, operations = undefined) => {
    return { id, startTime, text, operations }
  }

  useEffect(() => {
    if (!media.media.isUnavailable) {
      _.map(media.media.transcriptions, (val) => {
        if (val.language === language) {
          api.getCaptionsByTranscriptionId(val.id).then((res) => {
            if (res && res.status === 200)
              // res.data is the captions array
              setCaptions(res.data)
          })
        }
      })
    }
  }, [media])

  useEffect(
    () => {
      tableRef.current.recomputeRowHeights();
      // get the begin time of selected caption
      _.map(transcript, (val) => {
        if (val.index === selectedIndex + 1) {
          // console.log(selectedIndex,
          //   val.begin,
          //   timestr.toSeconds(val.begin))
        }
      })
    }
    , [selectedIndex]
  );

  const columns =
    [
      {
        width: 250,
        label: 'Time',
        dataKey: 'startTime',
      },
      {
        width: 250,
        label: 'Caption',
        dataKey: 'text',
      },
    ]

  // const handleSeek = () => {
  //   const time = timeStrToSec(begin);
  //   videoControl.currTime(time);
  // };

  for (let i = 0; i < transcript.length; i += 1) {
    data_rows.push(createData(i, 
      <button
        className="plain-btn caption-line-time-display"
          // onClick={handleSeek}
        aria-label={`Jump to ${transcript[i].begin.split('.')[0]}`}
      >
        <span tabIndex="-1">{transcript[i].begin.split('.')[0]}</span>
      </button>, 
      <CaptionLine
        key={transcript[i].id}
        caption={transcript[i]}
        // isEditing={Boolean(currEditing) && currEditing.id === caption.id}
        // currCaption={currCaption}
        // isCurrent={isCurrent(caption.id)}
      />,
      // <Button id="delete-button">
      //   <i className="material-icons" id="delete-icon">delete</i>
      //   Delete
      // </Button>
    ));
  }

  const rowRenderer = props => {
    const { index, style, className, key, rowData } = props;
    return defaultTableRowRenderer(props)
  };

  const headerRenderer = ({ label, columnIndex }) => {
    return (
      <TableCell
        component="div"
        variant="head"
        align="right"
        id="header"
      >
        <span>{label}</span>
      </TableCell>
    );
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
            height={500}
            width={width}
            headerHeight={48}
            rowHeight={48}
            rowGetter={({ index }) => data_rows[index]}
            rowCount={data_rows.length}
          // scrollToIndex={captionIndex}
          // rowRenderer={(props) => rowRenderer({
          //   ...props,
          //   onRowClick: () => {
          //     onRowClick()
          //     if (selectedIndex === props.index) {
          //       setSelectedIndex(-1)
          //     } else {
          //       setSelectedIndex(props.index)
          //     }
          //   },
          // })}
          >
            <Column
              headerRenderer={() =>
                headerRenderer({
                  label: 'Time',
                  columnIndex: 0,
                })}
              dataKey="startTime"
              cellRenderer={cellRenderer}
              width={100}
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

export default TransTable;
