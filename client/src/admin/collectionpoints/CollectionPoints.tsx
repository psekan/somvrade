import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  makeStyles,
  TableHead,
  IconButton,
  TablePagination,
  Snackbar,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import AddNewEntryIcon from '@material-ui/icons/AddToPhotos';
import ClockIcon from '@material-ui/icons/QueryBuilder';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/SearchOutlined';
import InfoIcon from '@material-ui/icons/ListAlt';
import { matchSorter } from 'match-sorter';
import { WaitingEntryDialog } from './WaitingEntryDialog';
import { SetBreakDialog } from './SetBreakDialog';
import { EntryDetailDialog } from './EntryDetailDialog';
import { useCollectionPointsAdmin, CollectionPointEntity } from '../../services';

const useStyles = makeStyles(theme => ({
  container: {
    padding: 0,
  },
  table: {
    width: '100%',
  },
  rowActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  searchInput: {
    margin: '10px 0',
    padding: '10px',
  },
  breakInfo: {
    color: theme.palette.primary.main,
  },
  breakInfoIcon: {
    verticalAlign: 'bottom',
  },
}));

type CollectionPointsProps = {
  onlyWaiting: boolean;
};

const DEFAULT_PAGE_SIZE = 10;

export function CollectionPoints(props: CollectionPointsProps) {
  const classes = useStyles();
  const [dialogEntity, setDialogEditingEntity] = useState<{
    entity: CollectionPointEntity;
    dialog: 'break' | 'addentry' | 'detail';
  }>();
  const { isLoading, response, error, refresh } = useCollectionPointsAdmin();
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const data = matchSorter(response || [], filter, {
    keys: ['county', 'city', 'district', 'address'],
  });

  const pagedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const pagination = (
    <TablePagination
      rowsPerPageOptions={[5, 10, 25, 50, 100, 200]}
      component="div"
      count={data.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      labelRowsPerPage={''}
    />
  );

  return (
    <>
      <TableContainer className={classes.container}>
        {isLoading && <LinearProgress />}
        {error && <Alert severity={'error'}>{JSON.stringify(error)}</Alert>}
        <div className={classes.searchInput}>
          <TextField
            fullWidth
            variant={'outlined'}
            label={'Vyhľadávanie'}
            size={'small'}
            InputProps={{
              endAdornment: <SearchIcon />,
            }}
            onChange={evt => {
              setFilter(evt.target.value);
              setPage(0);
            }}
          />
        </div>
        {pagination}
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              <TableCell>Odberné miesto</TableCell>
              <TableCell align="right">Možnosti</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedData.map(row => (
              <Row
                key={row.id}
                entity={row}
                handleAddEntry={entity =>
                  setDialogEditingEntity({
                    entity,
                    dialog: 'addentry',
                  })
                }
                handleBreak={entity =>
                  setDialogEditingEntity({
                    entity,
                    dialog: 'break',
                  })
                }
                handleDetail={entity =>
                  setDialogEditingEntity({
                    entity,
                    dialog: 'detail',
                  })
                }
              />
            ))}
          </TableBody>
        </Table>
        {pagination}
      </TableContainer>
      <WaitingEntryDialog
        entity={dialogEntity?.dialog === 'addentry' ? dialogEntity.entity : undefined}
        onCancel={() => setDialogEditingEntity(undefined)}
        onConfirm={() => {
          setDialogEditingEntity(undefined);
          setSuccessMessage('Vaše údaje boli úspešne uložené.');
          refresh();
        }}
      />
      <SetBreakDialog
        entity={dialogEntity?.dialog === 'break' ? dialogEntity.entity : undefined}
        onCancel={() => setDialogEditingEntity(undefined)}
        onConfirm={() => {
          setDialogEditingEntity(undefined);
          setSuccessMessage('Vaše údaje boli úspešne uložené.');
          refresh();
        }}
      />
      <EntryDetailDialog
        entity={dialogEntity?.dialog === 'detail' ? dialogEntity.entity : undefined}
        onCancel={() => setDialogEditingEntity(undefined)}
      />
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

function Row({
  entity,
  handleBreak,
  handleAddEntry,
  handleDetail,
}: {
  entity: CollectionPointEntity;
  handleBreak: (entity: CollectionPointEntity) => void;
  handleAddEntry: (entity: CollectionPointEntity) => void;
  handleDetail: (entity: CollectionPointEntity) => void;
}) {
  const classes = useStyles();

  return (
    <TableRow key={entity.id}>
      <TableCell component="th" scope="row">
        {entity.county}
        <br />
        {entity.region}
        <br />
        <strong>{entity.city}</strong>
        <br />
        <strong>{entity.address}</strong>
        {entity.break_start ? (
          <span className={classes.breakInfo}>
            <br />
            <ClockIcon fontSize={'small'} className={classes.breakInfoIcon} />
            Prestávka do {entity.break_stop}
          </span>
        ) : (
          ''
        )}
      </TableCell>
      <TableCell component="th" scope="row" align="right">
        <div className={classes.rowActions}>
          <IconButton
            color={'primary'}
            title={'Zadať počet čakajúcich'}
            onClick={() => handleAddEntry(entity)}
          >
            <AddNewEntryIcon />
          </IconButton>

          <IconButton
            color={'primary'}
            title={'Spravovať prestávky'}
            onClick={() => handleBreak(entity)}
          >
            <ClockIcon />
          </IconButton>
          <IconButton
            color={'primary'}
            title={'Spravovať prestávky'}
            onClick={() => handleDetail(entity)}
          >
            <InfoIcon />
          </IconButton>
        </div>
      </TableCell>
    </TableRow>
  );
}
