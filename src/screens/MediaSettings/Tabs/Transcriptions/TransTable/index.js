import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import _ from 'lodash';
import { util, api } from 'utils';
import { CTFragment } from 'layout';
import Table from '@material-ui/core/Table';
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
import { connectWithRedux } from '../../../controllers/trans';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;
  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };
  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };
  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };
  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div id="footer-root">
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

function TransTable(media = undefined) {
  const data_rows = []
  const [language, setLanguage] = useState('en-US')
  const [captions, setCaptions] = useState([])
  const [data_pair, setDataPair] = useState({})

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const createData = (start_time, text) => {
    // setDataPair({start_time, text});
    return {start_time, text};
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (!media.media.isUnavailable) {
      media.media.transcriptions.forEach(
        (val) => {
          if (val.language === language) {
            api.getCaptionsByTranscriptionId(val.id).then((res) => {
              if (res && res.status === 200)
                // res.data is the captions array
                setCaptions(res.data)
            })
          }
        }
      )
    }
  }, [media])

  // captions.map((cap) => {
  //   data_rows.push(createData(cap.begin, cap.text));
  // });

  for (let i = 0; i < captions.length; i+=1) {
    data_rows.push(createData(captions[i].begin, captions[i].text));
  }

  return (
    <CTFragment id="msp-t-table-con" data-scroll>
      <Table id="table-root">
        <TableHead>
          <TableRow>
            <TableCell align="center">Start Time</TableCell>
            <TableCell align="center">Text</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? data_rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data_rows
          ).map((row) => (
            <TableRow key={row.start_time}>
              <TableCell align="center">{row.start_time}</TableCell>
              <TableCell align="center">{row.text}</TableCell>
            </TableRow>
          ))}
        </TableBody>

        {/* used to set pages */}
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[10, 50, 100, { label: 'All', value: -1 }]}
              colSpan={3}
              count={data_rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </CTFragment>
  );
}

export default connectWithRedux(
  TransTable,
  [],
  [],
  ['media']
);
