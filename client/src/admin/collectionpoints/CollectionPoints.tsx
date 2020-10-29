import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  TableRow,
  makeStyles,
  TableHead,
  IconButton,
  Divider,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteIcon from '@material-ui/icons/Delete';
import AcceptIcon from '@material-ui/icons/Check';
import {
  useCollectionPoints,
  CollectionPointEntity,
  approveCollectionPoint,
  deleteCollectionPoint,
} from '../../services';
import { Session, useSession } from '../../Session';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  rowActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

export function CollectionPoints() {
  const classes = useStyles();
  const [session] = useSession();
  const { isLoading, response, error, refresh } = useCollectionPoints();

  return (
    <TableContainer component={Paper}>
      {isLoading && <LinearProgress />}
      {error && <Alert severity={'error'}>{JSON.stringify(error)}</Alert>}
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Nazov odberneho miesta</TableCell>
            <TableCell>Okres</TableCell>
            <TableCell>Mesto</TableCell>
            <TableCell>Okrsok</TableCell>
            <TableCell align="right">Moznosti</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(response?.data || []).map(row => (
            <Row entity={row} session={session} onActionDone={refresh} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function Row({
  entity,
  session,
  onActionDone,
}: {
  entity: CollectionPointEntity;
  session: Session;
  onActionDone: () => void;
}) {
  const classes = useStyles();
  const [actionLoading, setActionLoading] = useState(false);

  async function handleDelete(entity: CollectionPointEntity) {
    setActionLoading(true);
    try {
      await deleteCollectionPoint(entity.id, session);
      onActionDone();
    } finally {
      setActionLoading(false);
    }
  }

  async function handleApprove(entity: CollectionPointEntity) {
    setActionLoading(true);
    try {
      await approveCollectionPoint(entity.id, session);
      onActionDone();
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <TableRow key={entity.id}>
      <TableCell component="th" scope="row">
        {entity.place}
      </TableCell>
      <TableCell component="th" scope="row">
        {entity.county}
      </TableCell>
      <TableCell component="th" scope="row">
        {entity.city}
      </TableCell>
      <TableCell component="th" scope="row">
        {entity.district}
      </TableCell>
      <TableCell component="th" scope="row" align="right">
        {actionLoading && <CircularProgress size={25} />}
        {!actionLoading && (
          <div className={classes.rowActions}>
            <IconButton
              color={'primary'}
              title={'Akceptuj'}
              size={'small'}
              onClick={() => handleApprove(entity)}
            >
              <AcceptIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <IconButton
              color={'secondary'}
              title={'Vymaz'}
              size={'small'}
              onClick={() => handleDelete(entity)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}
