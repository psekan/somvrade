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
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import AddNewEntryIcon from '@material-ui/icons/AddToPhotos';
import ClockIcon from '@material-ui/icons/QueryBuilder';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/SearchOutlined';
import { matchSorter } from 'match-sorter';
import { WaitingEntryDialog } from './WaitingEntryDialog';
import { SetBreakDialog } from './SetBreakDialog';
import { useCollectionPointsAdmin, CollectionPointEntity } from '../../services';

const useStyles = makeStyles({
  container: {
    padding: 0,
  },
  table: {
    width: '100%',
  },
  rowActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  searchInput: {
    margin: '10px 0',
    padding: '10px',
  },
});

type CollectionPointsProps = {
  onlyWaiting: boolean;
};

const DEFAULT_PAGE_SIZE = 10;

export function CollectionPoints(props: CollectionPointsProps) {
  const classes = useStyles();
  const [dialogEntity, setDialogEditingEntity] = useState<{
    entity: CollectionPointEntity;
    dialog: 'break' | 'addentry';
  }>();
  const { isLoading, response, error, refresh } = useCollectionPointsAdmin();
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);

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
          refresh();
        }}
      />
      <SetBreakDialog
        entity={dialogEntity?.dialog === 'break' ? dialogEntity.entity : undefined}
        onCancel={() => setDialogEditingEntity(undefined)}
        onConfirm={() => {
          setDialogEditingEntity(undefined);
          refresh();
        }}
      />
    </>
  );
}

function Row({
  entity,
  handleBreak,
  handleAddEntry,
}: {
  entity: CollectionPointEntity;
  handleBreak: (entity: CollectionPointEntity) => void;
  handleAddEntry: (entity: CollectionPointEntity) => void;
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
          <>
            <br />
            <ClockIcon fontSize={'small'} />
            Prestávka do {entity.break_stop}
          </>
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
        </div>
      </TableCell>
    </TableRow>
  );
}
