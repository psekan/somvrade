import React from 'react';
import { LinearProgress, makeStyles } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { CollectionPointEntity, useCollectionPointEntries } from '../../services';

const useStyles = makeStyles({
  headerCell: {
    fontSize: '0.8rem',
    lineHeight: '0.8rem',
  },
});

interface CollectionEntriesProps {
  collectionPoint: CollectionPointEntity;
  className?: string;
}

export function CollectionEntries({ collectionPoint, className }: CollectionEntriesProps) {
  const classes = useStyles();
  const { response, isLoading } = useCollectionPointEntries(collectionPoint.id);
  return (
    <TableContainer component={Paper} className={className}>
      {isLoading && <LinearProgress />}
      <Table size={'small'}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.headerCell}>Navstevnik prisiel o:</TableCell>
            <TableCell align={'center'} className={classes.headerCell}>
              Pocet osob pred nim:
            </TableCell>
            <TableCell align={'right'} className={classes.headerCell}>
              Navstevnik odisiel o:
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(response || []).map(row => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.arrive}
              </TableCell>
              <TableCell component="th" scope="row" align={'center'}>
                {row.length}
              </TableCell>
              <TableCell component="th" scope="row" align={'right'}>
                {row.departure}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
