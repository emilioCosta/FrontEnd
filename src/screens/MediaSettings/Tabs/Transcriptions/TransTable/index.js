import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import _ from 'lodash';
import { util, api, timestr } from 'utils';
import { CTFragment } from 'layout';
// import Table from '@material-ui/core/Table';
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
import { AutoSizer, Column, Table } from 'react-virtualized';
import Paper from '@material-ui/core/Paper';
import { connectWithRedux } from '../../../controllers/trans';
import 'react-virtualized/styles.css'




// function TablePaginationActions(props) {
//   const theme = useTheme();
//   const { count, page, rowsPerPage, onChangePage } = props;
//   const handleFirstPageButtonClick = (event) => {
//     onChangePage(event, 0);
//   };
//   const handleBackButtonClick = (event) => {
//     onChangePage(event, page - 1);
//   };
//   const handleNextButtonClick = (event) => {
//     onChangePage(event, page + 1);
//   };
//   const handleLastPageButtonClick = (event) => {
//     onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
//   };

//   return (
//     <div id="footer-root">
//       <IconButton
//         onClick={handleFirstPageButtonClick}
//         disabled={page === 0}
//         aria-label="first page"
//       >
//         {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
//       </IconButton>
//       <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
//         {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
//       </IconButton>
//       <IconButton
//         onClick={handleNextButtonClick}
//         disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//         aria-label="next page"
//       >
//         {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
//       </IconButton>
//       <IconButton
//         onClick={handleLastPageButtonClick}
//         disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//         aria-label="last page"
//       >
//         {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
//       </IconButton>
//     </div>
//   );
// }

function TransTable(media = undefined) {
  const [language, setLanguage] = useState('en-US')
  const [captions, setCaptions] = useState([])
  const data_rows = []
  const [open, setOpen] = useState(false)

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [captionIndex, setCaptionIndex] = useState(0)

  const createData = (id, startTime, text) => {
    return { id, startTime, text }
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

  // captions.map(
  //   function capToData(cap) {
  //     data_rows.push(createData(cap.begin.split('.')[0], cap.text));
  //   }
  // );

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

  for (let i = 0; i < captions.length; i += 1) {
    data_rows.push(createData(i, captions[i].begin.split('.')[0], captions[i].text));
  }

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

  const cellRenderer = ({ cellData, columnIndex }) => {
    if (cellData !== undefined) {
      return (
        <TableCell
          component="div"
          id={`cell-${columnIndex}`}
          variant="body"
          align="right"
          onClick={() => {
            setOpen(!open)
          }}
        >
          {/* <Collapse in={open} timeout="auto" unmountOnExit>
            {console.log(cellData)}
            wtf
          </Collapse> */}
          {cellData}
        </TableCell>
      );
    }
  };

  return (
    <CTFragment id="msp-t-table-con" data-scroll>
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={48}
            headerHeight={48}
            rowGetter={({ index }) => data_rows[index]}
            rowCount={data_rows.length}
            scrollToIndex={captionIndex}
          >
            <Column
              headerRenderer={() =>
                headerRenderer({
                  label: 'Time',
                  columnIndex: 0,
                })}
              // className={classes.flexContainer}
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
              // className={classes.flexContainer}
              dataKey="text"
              cellRenderer={cellRenderer}
              width={400}
            />

          </Table>
        )}
      </AutoSizer>
    </CTFragment>
  );
}

export default TransTable;
